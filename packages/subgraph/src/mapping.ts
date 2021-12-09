import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestEntity } from "../generated/schema";
import { Entity, ipfs, json, JSONValue, Value } from "@graphprotocol/graph-ts";

export function handleIpfsResult(value: JSONValue, questEntityId: Value): void {
  let questEntity = new QuestEntity(questEntityId.toString());
  //   if (value.isNull()) {
  //     // Continue with IPFS link as the description
  //     questEntity.questDescription = `A problem occured when trying to fetch description from IPFS but it is available here :
  //       https://ipfs.io/ipfs/${event.params.questDetailsRef}`;
  //   }

  let detailsObj = value.toObject();
  let description = detailsObj.get("description");
  questEntity.questDescription = description ? description.toString() : "";
  questEntity.save();
}

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.questDetailsRef = event.params.questDetailsRef;
  questEntity.questDescription = "";
  questEntity.save();

  if (event.params.questDetailsRef) {
    // Fetching quest description with IPFS
    ipfs.map(
      event.params.questDetailsRef.toString(),
      "handleIpfsResult",
      Value.fromString(questEntity.id),
      ["json"]
    );
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
