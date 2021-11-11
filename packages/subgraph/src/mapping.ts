import { QuestCreated } from "../generated/QuestFactory/QuestFactory";
import { QuestEntity } from "../generated/schema";
import { ipfs, json } from "@graphprotocol/graph-ts";

export function handleQuestCreated(event: QuestCreated): void {
  let questEntity = new QuestEntity(event.params.questAddress.toHex());

  let questDataBytes = ipfs.cat(event.params.requirementsIpfsHash);

  questEntity.questAddress = event.params.questAddress.toHexString();
  questEntity.questRewardTokenAddress = event.params.rewardTokenAddress;
  questEntity.questExpireTimeSec = event.params.expireTime;
  questEntity.questVersion = event.params.version;

  questEntity.questMetaIpfsHash = event.params.requirementsIpfsHash;

  if (!questDataBytes)
    throw new Error(
      `[Quest metatdata] IPFS file not found with cat : ${event.params.requirementsIpfsHash}
        Quest address : ${questEntity.questAddress}
        Quest Version : ${questEntity.questVersion}
        `
    );

  let metadata = json.fromBytes(questDataBytes).toObject();

  // Extract data from IPFS
  let title = metadata.get("title");
  questEntity.questMetaTitle = title ? title.toString() : "";

  let description = metadata.get("description");
  questEntity.questMetaDescription = description ? description.toString() : "";

  let collateral = metadata.get("collateral");
  questEntity.questMetaCollateralPercentage = collateral
    ? collateral.toBigInt()
    : null;

  let tags = metadata.get("tags");
  questEntity.questMetaTags = tags
    ? tags
        .toArray()
        .filter((x) => !x.isNull())
        .map<string>((x) => x.toString())
    : [];

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
