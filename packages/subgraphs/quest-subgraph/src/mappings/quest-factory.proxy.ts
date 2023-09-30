import { QuestCreated } from "../../generated/QuestFactoryProxy/QuestFactory";
import { QuestWhiteListChanged } from "../../generated/QuestFactoryProxy-Quest/Quest";
import { QuestEntity } from "../../generated/schema";
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts";
import {
  handleCreateDepositChanged,
  handlePlayDepositChanged,
  handleQuestClaimed,
  handleQuestUnplayed,
  handleQuestPlayed,
} from "./quest-factory.2";

// Reuse old version since no change needed for this QuestFactory version
export {
  handleCreateDepositChanged,
  handlePlayDepositChanged,
  handleQuestClaimed,
  handleQuestUnplayed,
  handleQuestPlayed,
};

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());
  questEntity.version = event.params.version.toI32();
  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.block.timestamp;
  questEntity.questFundsRecoveryAddress = event.params.fundsRecoveryAddress;
  questEntity.questCreateDepositToken = event.params.createDeposit.token;
  questEntity.questCreateDepositAmount = event.params.createDeposit.amount;
  questEntity.questPlayDepositToken = event.params.playDeposit.token;
  questEntity.questPlayDepositAmount = event.params.playDeposit.amount;
  questEntity.questCreator = event.params.creator;
  questEntity.questMaxPlayers = event.params.maxPlayers;
  questEntity.questPlayers = [];
  questEntity.questIsWhiteListed = event.params.isWhiteList;

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

export function handleQuestWhiteListChanged(
  event: QuestWhiteListChanged
): void {
  const questAddress = event.address.toHex();
  let questEntity = QuestEntity.load(questAddress);
  if (!questEntity) {
    log.error("Quest entity not found with address: {}", [questAddress]);
    return;
  }
  questEntity.questPlayers = [];
  for (let index = 0; index < event.params.whiteListPlayers.length; index++) {
    const playerAddress = event.params.whiteListPlayers[index];
    questEntity.questPlayers.push(playerAddress.toHexString());
  }
  questEntity.save();
}
