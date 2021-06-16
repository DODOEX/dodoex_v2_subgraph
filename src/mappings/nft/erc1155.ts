import {Nft, Fragment, User, UserNft} from "../../types/nft/schema";
import {Address,BigInt} from "@graphprotocol/graph-ts";
import {TransferBatch, TransferSingle} from "../../types/nft/DODONFT1155/DODONFT1155"
import {createUser, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";
import {DODONFTBurn, DODONFTMint} from "../../types/nft/DODONFT/DODONFT";

export function handleTransferSingle(event: TransferSingle): void {
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let nft = createAndGetNFT(event.address);

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.id.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.id.toString());
    let fromUserNft = UserNft.load(fromUserNftId);
    let toUserNft = UserNft.load(toUserNftId);

    if (fromUserNft == null) {
        fromUserNft = new UserNft(fromUserNftId)
        fromUserNft.owner = fromUser.id;
        fromUserNft.amount = ZERO_BI;
        fromUserNft.nft = nft.id;
    }
    fromUserNft.tokenID = event.params.id;
    fromUserNft.amount = fromUserNft.amount.minus(event.params.value);
    fromUserNft.save();

    if (toUserNft == null) {
        toUserNft = new UserNft(toUserNftId)
        toUserNft.owner = toUser.id;
        toUserNft.amount = ZERO_BI;
        toUserNft.nft = nft.id;
    }
    toUserNft.tokenID = event.params.id;
    toUserNft.amount = toUserNft.amount.plus(event.params.value);
    toUserNft.save();
}

export function handleTransferBatch(event: TransferBatch): void {
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let nft = createAndGetNFT(event.address);

    let ids = event.params.ids;
    let values = event.params.values;

    for (let i = 0; i < ids.length; i++) {
        let tokenId: BigInt = ids[i];
        let amount: BigInt = values[i];
        let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(tokenId.toString());
        let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(tokenId.toString());
        let fromUserNft = UserNft.load(fromUserNftId);
        let toUserNft = UserNft.load(toUserNftId);

        if (fromUserNft == null) {
            fromUserNft = new UserNft(fromUserNftId)
            fromUserNft.owner = fromUser.id;
            fromUserNft.amount = ZERO_BI;
            fromUserNft.nft = nft.id;
        }
        fromUserNft.tokenID = tokenId;
        fromUserNft.amount = fromUserNft.amount.minus(amount);
        fromUserNft.save();

        if (toUserNft == null) {
            toUserNft = new UserNft(toUserNftId)
            toUserNft.owner = toUser.id;
            toUserNft.amount = ZERO_BI;
            toUserNft.nft = nft.id;
        }
        toUserNft.tokenID = tokenId;
        toUserNft.amount = toUserNft.amount.plus(amount);
        toUserNft.save();
    }
}

export function handleDODONFTMint(event: DODONFTMint): void {

}

export function handleDODONFTBurn(event: DODONFTBurn): void {

}