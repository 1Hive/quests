import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestCreated as QuestCreatedV2 } from "../generated/QuestFactoryV2/QuestFactory";
import { QuestCreated as QuestCreatedV3 } from "../generated/QuestFactoryV3/QuestFactoryV3";
import {
  QuestCreated as QuestCreatedV4,
  DepositChanged,
} from "../generated/QuestFactoryV4/QuestFactoryV4";
import { DepositEntity, QuestEntity } from "../generated/schema";
import { Bytes, ipfs } from "@graphprotocol/graph-ts";

export function handleDepositChanged(event: DepositChanged): void {
  let questEntity = new DepositEntity(
    `${event.params.timestamp.toString()}_${event.params.token.toHex()}_${event.params.amount.toHex()}`
  );

  questEntity.timestamp = event.params.timestamp;
  questEntity.depositToken = event.params.token;
  questEntity.depositAmount = event.params.amount;

  questEntity.save();
}

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;

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
      let description = questDataBytes.toString();
      questEntity.questDescription = description ? description.toString() : "";
    } else {
      // Continue with empty description
      questEntity.questDescription = "";
    }
  }

  questEntity.save();
}

export function handleQuestCreatedV2(event: QuestCreatedV2): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.params.creationTime;

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
      let description = questDataBytes.toString();
      questEntity.questDescription = description ? description.toString() : "";
    } else {
      // Continue with empty description
      questEntity.questDescription = "";
    }
  }

  questEntity.save();
}

export function handleQuestCreatedV3(event: QuestCreatedV3): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.params.creationTime;
  questEntity.depositToken = event.params.depositToken;
  questEntity.depositAmount = event.params.depositAmount;

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
      let description = questDataBytes.toString();
      questEntity.questDescription = description ? description.toString() : "";
    } else {
      // Continue with empty description
      questEntity.questDescription = "";
    }
  }

  questEntity.save();
}

export function handleQuestCreatedV4(event: QuestCreatedV4): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.creationTimestamp = event.params.creationTime;
  questEntity.questFundsRecoveryAddress = event.params.fundsRecoveryAddress;
  questEntity.depositToken = event.params.depositToken;
  questEntity.depositAmount = event.params.depositAmount;
  questEntity.questCreator = event.params.creator;

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
      let description = questDataBytes.toString();
      questEntity.questDescription = description ? description.toString() : "";
    } else {
      // Continue with empty description
      questEntity.questDescription = "";
    }
  }

  questEntity.save();
}
