import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestEntity } from "../generated/schema";
import { ipfs, json } from "@graphprotocol/graph-ts";

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questTitle = event.params.questTitle;
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.questDetailsRef = event.params.questDetailsRef;

  if (!event.params.questDetailsRef) {
    questEntity.questDescription = "";
  } else {
    // Fetching quest description with IPFS
    let questDataBytes = ipfs.cat(event.params.questDetailsRef.toString());
    if (!questDataBytes) {
      // Continue with IPFS link as the description
      questEntity.questDescription = `A problem occured when trying to fetch description from IPFS but it is available here :
      https://ipfs.io/ipfs/${event.params.questDetailsRef}`;
    } else {
      let ipfsObj = json.fromBytes(questDataBytes).toObject();
      let description = ipfsObj.get("description");
      questEntity.questDescription = description ? description.toString() : "";
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
