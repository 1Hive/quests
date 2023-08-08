import {
  QuestCreated,
  PlayDepositChanged,
  CreateDepositChanged,
} from "../../generated/QuestFactoryV2/QuestFactory";
import {
  QuestPlayed,
  QuestClaimed,
  QuestUnplayed,
} from "../../generated/QuestFactoryV2-Quest/Quest";
import {
  CreateDepositEntity,
  PlayDepositEntity,
  QuestClaimEntity,
  QuestEntity,
} from "../../generated/schema";
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts";

export function handleCreateDepositChanged(event: CreateDepositChanged): void {
  let depositEntity = new CreateDepositEntity(
    `Create_${event.params.timestamp.toString()}_${event.params.token.toHex()}_${event.params.amount.toHex()}`
  );

  depositEntity.timestamp = event.params.timestamp;
  depositEntity.depositToken = event.params.token;
  depositEntity.depositAmount = event.params.amount;

  depositEntity.save();
}

export function handlePlayDepositChanged(event: PlayDepositChanged): void {
  let depositEntity = new PlayDepositEntity(
    `Play_${event.params.timestamp.toString()}_${event.params.token.toHex()}_${event.params.amount.toHex()}`
  );

  depositEntity.timestamp = event.params.timestamp;
  depositEntity.depositToken = event.params.token;
  depositEntity.depositAmount = event.params.amount;

  depositEntity.save();
}

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());
  questEntity.version = 1;
  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.block.timestamp;
  questEntity.questFundsRecoveryAddress = event.params.fundsRecoveryAddress;
  questEntity.questCreateDepositToken = event.params.createDepositToken;
  questEntity.questCreateDepositAmount = event.params.createDepositAmount;
  questEntity.questPlayDepositToken = event.params.playDepositToken;
  questEntity.questPlayDepositAmount = event.params.playDepositAmount;
  questEntity.questCreator = event.params.creator;
  questEntity.questMaxPlayers = event.params.maxPlayers;
  questEntity.questPlayers = [];

  if (!event.params.questDetailsRef) {
    questEntity.questDescription = "";
  } else {
    // Fetching quest description with IPFS
    let questDataBytes: Bytes | null = null;
    let tryCount = 0;
    while (!questDataBytes && tryCount < 3) {
      // 3 tries in total (180 sec for each try)
      questDataBytes = ipfs.cat(event.params.questDetailsRef.toString());
      tryCount = tryCount + 1;
    }
    if (questDataBytes) {
      let jsonResult = json.try_fromBytes(questDataBytes);
      if (jsonResult.isOk) {
        let jsonObject = jsonResult.value.toObject();
        let communicationLink = jsonObject.get("communicationLink");
        let questDescription = jsonObject.get("description");
        questEntity.questCommunicationLink = communicationLink
          ? communicationLink.toString()
          : "";
        questEntity.questDescription = questDescription
          ? questDescription.toString()
          : "";
      } else {
        let description = questDataBytes.toString();
        questEntity.questDescription = description
          ? description.toString()
          : "";
      }
    } else {
      // Continue with empty description
      questEntity.questDescription = "";
    }
  }

  questEntity.save();
}

export function handleQuestPlayed(event: QuestPlayed): void {
  const questAddress = event.address.toHex();
  let questEntity = QuestEntity.load(questAddress);

  if (!questEntity) {
    log.error("Quest entity not found with address: {}", [questAddress]);
    return;
  }
  let questPlayers = questEntity.questPlayers;
  questPlayers.push(event.params.player.toHexString());
  questEntity.questPlayers = questPlayers;
  questEntity.save();
}

export function handleQuestUnplayed(event: QuestUnplayed): void {
  const questAddress = event.address.toHex();
  let questEntity = QuestEntity.load(questAddress);
  if (!questEntity) {
    log.error("Quest entity not found with address: {}", [questAddress]);
    return;
  }
  let questPlayers = questEntity.questPlayers;
  const indexToBeRemoved = questEntity.questPlayers.indexOf(
    event.params.player.toHexString()
  );
  if (indexToBeRemoved === -1) {
    log.error("Player not found in quest {} players list: {}", [
      questAddress,
      event.params.player.toHexString(),
    ]);
    return;
  }
  questPlayers.splice(indexToBeRemoved, 1);
  questEntity.questPlayers = questPlayers;
  questEntity.save();
}

export function handleQuestClaimed(event: QuestClaimed): void {
  const questClaimEntity = new QuestClaimEntity(
    event.params._event.transaction.hash.toHex()
  );
  questClaimEntity.questAddress = event.address.toHexString();
  questClaimEntity.amount = event.params.amount;
  questClaimEntity.evidenceIpfsHash = event.params.evidence;
  questClaimEntity.player = event.params.player.toHexString();
  questClaimEntity.save();
}
