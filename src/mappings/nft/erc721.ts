import {Nft, Fragment, User, UserNft} from "../../types/nft/schema";
import {Address} from "@graphprotocol/graph-ts";
import {Transfer} from "../../types/nft/DODONFT/DODONFT"
import {DODONFTMint, DODONFTBurn,DODONFT} from "../../types/nft/DODONFT/DODONFT"
import {createUser, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";

export function handleTransfer(event: Transfer): void {
    let fromUser = createUser(event.params.from,event);
    let toUser = createUser(event.params.to,event);
    let nft = createAndGetNFT(event.address,event);
    nft.type = "721";

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let fromUserNft = UserNft.load(fromUserNftId);
    let toUserNft = UserNft.load(toUserNftId);

    if (fromUserNft == null) {
        fromUserNft = new UserNft(fromUserNftId);
        fromUserNft.owner = fromUser.id;
        fromUserNft.amount = ZERO_BI;
        fromUserNft.nft = nft.id;
        fromUserNft.createdAt = event.block.timestamp;
    }
    fromUserNft.tokenID = event.params.tokenId;
    fromUserNft.amount = ZERO_BI;

    if (toUserNft == null) {
        toUserNft = new UserNft(toUserNftId);
        toUserNft.owner = toUser.id;
        toUserNft.amount = ZERO_BI;
        toUserNft.nft = nft.id;
        toUserNft.createdAt = event.block.timestamp;
    }
    toUserNft.tokenID = event.params.tokenId;
    toUserNft.amount = ONE_BI;

    //更新时间戳
    nft.updatedAt = event.block.timestamp;
    fromUserNft.updatedAt = event.block.timestamp;
    toUserNft.updatedAt = event.block.timestamp;

    nft.save();
    fromUserNft.save();
    toUserNft.save();
}

export function handleDODONFTMint(event: DODONFTMint): void {

}

export function handleDODONFTBurn(event: DODONFTBurn): void {

}
