import { QuestCreated } from "../../generated/QuestFactoryProxy/QuestFactory";
import { QuestWhiteListChanged } from "../../generated/QuestFactoryProxy-Quest/Quest";
import { QuestEntity } from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";
import { QuestMetadata as QuestMetadataTemplate } from "../../generated/templates";
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
  questEntity.questMetadata = event.params.questDetailsRef.toString();
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

  QuestMetadataTemplate.create(questEntity.questMetadata);

  log.info("Quest created [proxy]: {}", [event.params.questAddress.toHex()]);

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
