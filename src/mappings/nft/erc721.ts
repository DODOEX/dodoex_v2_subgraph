import {Nft, Fragment, User, UserNft} from "../../types/nft/schema";
import {Address} from "@graphprotocol/graph-ts";
import {Transfer} from "../../types/nft/DODONFT/DODONFT"
import {DODONFTMint, DODONFTBurn,DODONFT} from "../../types/nft/DODONFT/DODONFT"
import {createUser, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";

export function handleTransfer(event: Transfer): void {
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let nft = createAndGetNFT(event.address);
    nft.type = "721";
    nft.save();

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let fromUserNft = UserNft.load(fromUserNftId);
    let toUserNft = UserNft.load(toUserNftId);

    if (fromUserNft == null) {
        fromUserNft = new UserNft(fromUserNftId);
        fromUserNft.owner = fromUser.id;
        fromUserNft.amount = ZERO_BI;
        fromUserNft.nft = nft.id;
    }
    fromUserNft.tokenID = event.params.tokenId;
    fromUserNft.amount = ZERO_BI;
    fromUserNft.save();

    if (toUserNft == null) {
        toUserNft = new UserNft(toUserNftId);
        toUserNft.owner = toUser.id;
        toUserNft.amount = ZERO_BI;
        toUserNft.nft = nft.id;
    }
    toUserNft.tokenID = event.params.tokenId;
    toUserNft.amount = ONE_BI;
    toUserNft.save();
}

export function handleDODONFTMint(event: DODONFTMint): void {

}

export function handleDODONFTBurn(event: DODONFTBurn): void {

}
