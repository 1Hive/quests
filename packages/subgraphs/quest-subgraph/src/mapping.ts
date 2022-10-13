import { QuestCreated, DepositChanged } from "../generated/QuestFactory/QuestFactory";
import { DepositEntity, QuestEntity } from "../generated/schema";
import { Bytes, ipfs, JSONValue, Result } from "@graphprotocol/graph-ts";
import { json, JSONValueKind } from "@graphprotocol/graph-ts";
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
    questEntity.creationTimestamp = event.block.timestamp;
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
            let jsonResult = json.try_fromBytes(questDataBytes);
            if (jsonResult.isOk) {
                let jsonObject = jsonResult.value.toObject();
                let communicationLink = jsonObject.get("communicationLink");
                let questDescription = jsonObject.get("description");
                questEntity.questCommunicationLink = communicationLink ? communicationLink.toString() : "";
                questEntity.questDescription = questDescription ? questDescription.toString() : "";
            } else {
                let description = questDataBytes.toString();
                questEntity.questDescription = description ? description.toString() : "";
            }
        } else {
            // Continue with empty description
            questEntity.questDescription = "";
        }
    }

    questEntity.save();
}
