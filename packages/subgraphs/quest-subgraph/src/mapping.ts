import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestCreated as QuestCreatedV2 } from "../generated/QuestFactoryV2/QuestFactory";
import { QuestEntity } from "../generated/schema";
import { Bytes, ipfs } from "@graphprotocol/graph-ts";

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

  //   let collateral = metadata.get("collateral");
  //   questEntity.questMetaCollateralPercentage = collateral
  //     ? collateral.toBigInt()
  //     : null;

  //   let tags = metadata.get("tags");
  //   questEntity.questMetaTags = tags
  //     ? tags
  //         .toArray()
  //         .filter((x) => !x.isNull())
  //         .map<string>((x) => x.toString())
  //     : [];

  questEntity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.aragonGovernAddress(...)
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

  //   let collateral = metadata.get("collateral");
  //   questEntity.questMetaCollateralPercentage = collateral
  //     ? collateral.toBigInt()
  //     : null;

  //   let tags = metadata.get("tags");
  //   questEntity.questMetaTags = tags
  //     ? tags
  //         .toArray()
  //         .filter((x) => !x.isNull())
  //         .map<string>((x) => x.toString())
  //     : [];

  questEntity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.aragonGovernAddress(...)
}
