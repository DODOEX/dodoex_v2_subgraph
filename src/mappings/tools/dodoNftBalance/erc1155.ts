import {Balance} from "../../../types/tools/schema";
import {Address, BigInt} from "@graphprotocol/graph-ts";
import {TransferBatch, TransferSingle} from "../../../types/nft/DODONFT1155/DODONFT1155"
import {createAccount, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";
import {DODONFTBurn, DODONFTMint} from "../../../types/nft/DODONFT/DODONFT";

export function handleTransferSingle(event: TransferSingle): void {
    let fromUser = createAccount(event.params.from, event);
    let toUser = createAccount(event.params.to, event);
    let nft = createAndGetNFT(event.address, event.params.id, event);
    nft.type = "1155";

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.id.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.id.toString());
    let fromUserNftBalance = Balance.load(fromUserNftId);
    let toUserNftBalance = Balance.load(toUserNftId);

    if (fromUserNftBalance == null) {
        fromUserNftBalance = new Balance(fromUserNftId);
        fromUserNftBalance.account = fromUser.id;
        fromUserNftBalance.value = ZERO_BI;
        fromUserNftBalance.nft = nft.id;
        fromUserNftBalance.createdAt = event.block.timestamp;
        fromUserNftBalance.updatedAt = event.block.timestamp;
    }
    fromUserNftBalance.tokenID = event.params.id;
    fromUserNftBalance.value = fromUserNftBalance.value.minus(event.params.value);

    if (toUserNftBalance == null) {
        toUserNftBalance = new Balance(toUserNftId)
        toUserNftBalance.account = toUser.id;
        toUserNftBalance.value = ZERO_BI;
        toUserNftBalance.nft = nft.id;
        toUserNftBalance.createdAt = event.block.timestamp;
        toUserNftBalance.updatedAt = event.block.timestamp;
    }
    toUserNftBalance.tokenID = event.params.id;
    toUserNftBalance.value = toUserNftBalance.value.plus(event.params.value);

    //更新时间戳
    nft.updatedAt = event.block.timestamp;
    fromUserNftBalance.updatedAt = event.block.timestamp;
    toUserNftBalance.updatedAt = event.block.timestamp;

    nft.save();
    fromUserNftBalance.save();
    toUserNftBalance.save();
}

export function handleTransferBatch(event: TransferBatch): void {
    let fromUser = createAccount(event.params.from, event);
    let toUser = createAccount(event.params.to, event);

    let ids = event.params.ids;
    let values = event.params.values;

    for (let i = 0; i < ids.length; i++) {
        let tokenId: BigInt = ids[i];
        let nft = createAndGetNFT(event.address, tokenId, event);
        nft.type = "1155";
        let amount: BigInt = values[i];
        let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(tokenId.toString());
        let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(tokenId.toString());
        let fromUserNftBalance = Balance.load(fromUserNftId);
        let toUserNftBalance = Balance.load(toUserNftId);

        if (fromUserNftBalance == null) {
            fromUserNftBalance = new Balance(fromUserNftId)
            fromUserNftBalance.account = fromUser.id;
            fromUserNftBalance.value = ZERO_BI;
            fromUserNftBalance.nft = nft.id;
            fromUserNftBalance.createdAt = event.block.timestamp;
            fromUserNftBalance.updatedAt = event.block.timestamp;
        }
        fromUserNftBalance.tokenID = tokenId;
        fromUserNftBalance.value = fromUserNftBalance.value.minus(amount);

        if (toUserNftBalance == null) {
            toUserNftBalance = new Balance(toUserNftId)
            toUserNftBalance.account = toUser.id;
            toUserNftBalance.value = ZERO_BI;
            toUserNftBalance.nft = nft.id;
            toUserNftBalance.createdAt = event.block.timestamp;
            toUserNftBalance.updatedAt = event.block.timestamp;
        }
        toUserNftBalance.tokenID = tokenId;
        toUserNftBalance.value = toUserNftBalance.value.plus(amount);

        //更新时间戳
        fromUserNftBalance.updatedAt = event.block.timestamp;
        toUserNftBalance.updatedAt = event.block.timestamp;

        nft.save();
        fromUserNftBalance.save();
        toUserNftBalance.save();
    }
}

export function handleDODONFTMint(event: DODONFTMint): void {

}

export function handleDODONFTBurn(event: DODONFTBurn): void {

}