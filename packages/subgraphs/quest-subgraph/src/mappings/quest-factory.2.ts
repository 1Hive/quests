import {
  QuestCreated,
  PlayDepositChanged,
  CreateDepositChanged,
} from "../../generated/QuestFactoryV2/QuestFactory";
import {
  QuestPlayed,
  QuestUnplayed,
} from "../../generated/QuestFactoryV2-Quest/Quest";
import {
  CreateDepositEntity,
  PlayDepositEntity,
  QuestEntity,
} from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";
import { QuestMetadata as QuestMetadataTemplate } from "../../generated/templates";
import { handleQuestClaimed } from "./quest-factory";

// Reuse old version since no change needed for this QuestFactory version
export { handleQuestClaimed };

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());
  questEntity.version = 1;
  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questMetadata = event.params.questDetailsRef.toString();
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
  questEntity.questIsWhiteListed = false;
  questEntity.questPlayers = [];

  QuestMetadataTemplate.create(questEntity.questMetadata);

  log.info("Quest created [2]: {}", [event.params.questAddress.toHex()]);

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
