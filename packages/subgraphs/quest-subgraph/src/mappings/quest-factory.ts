import {
  QuestCreated,
  DepositChanged,
} from "../../generated/QuestFactory/QuestFactory";
import {
  CreateDepositEntity,
  QuestClaimEntity,
  QuestMetadata,
  QuestEntity,
} from "../../generated/schema";
import { Bytes, dataSource, json, log } from "@graphprotocol/graph-ts";
import { QuestClaimed } from "../../generated/QuestFactory-Quest/Quest";
import { QuestMetadata as QuestMetadataTemplate } from "../../generated/templates";

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());
  questEntity.version = 0;
  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questMetadata = event.params.questDetailsRef.toString();
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.block.timestamp;
  questEntity.questFundsRecoveryAddress = event.params.fundsRecoveryAddress;
  questEntity.questCreateDepositToken = event.params.depositToken;
  questEntity.questCreateDepositAmount = event.params.depositAmount;
  questEntity.questCreator = event.params.creator;
  questEntity.questMaxPlayers = null;
  questEntity.questPlayers = [];
  questEntity.questIsWhiteListed = false;

  QuestMetadataTemplate.create(questEntity.questMetadata);

  log.info("Quest created [2]: {}", [event.params.questAddress.toHex()]);

  questEntity.save();
}

export function handleQuestMetadata(content: Bytes): void {
  let detailMetadata = new QuestMetadata(dataSource.stringParam());
  const res = json.try_fromBytes(content);
  if (res.isOk) {
    let jsonObject = res.value.toObject();
    let communicationLink = jsonObject.get("communicationLink");
    let questDescription = jsonObject.get("description");
    detailMetadata.questCommunicationLink = communicationLink
      ? communicationLink.toString()
      : "";
    detailMetadata.questDescription = questDescription
      ? questDescription.toString()
      : "";
  } else {
    let description = content.toString();
    detailMetadata.questDescription = description ? description.toString() : "";
  }

  log.info("Quest description metadata: {}", [detailMetadata.id]);

  detailMetadata.save();
}

export function handleQuestClaimed(event: QuestClaimed): void {
  const questClaimEntity = new QuestClaimEntity(
    event.params._event.transaction.hash.toHex()
  );
  questClaimEntity.questAddress = event.params._event.address.toHexString();
  questClaimEntity.amount = event.params.amount;
  questClaimEntity.evidenceIpfsHash = event.params.evidence;
  questClaimEntity.player = event.params.player.toHexString();
  questClaimEntity.save();
}

export function handleDepositChanged(event: DepositChanged): void {
  let depositEntity = new CreateDepositEntity(
    `Create_${event.params.timestamp.toString()}_${event.params.token.toHex()}_${event.params.amount.toHex()}`
  );
  depositEntity.timestamp = event.params.timestamp;
  depositEntity.depositToken = event.params.token;
  depositEntity.depositAmount = event.params.amount;
  depositEntity.save();
}
