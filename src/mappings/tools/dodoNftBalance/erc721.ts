import {Nft, Balance} from "../../../types/tools/schema";
import {Address} from "@graphprotocol/graph-ts";
import {Transfer} from "../../../types/tools/DODONFT/DODONFT"
import {DODONFTMint, DODONFTBurn,DODONFT} from "../../../types/tools/DODONFT/DODONFT"
import {createAccount, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";

export function handleTransfer(event: Transfer): void {
    let fromUser = createAccount(event.params.from,event);
    let toUser = createAccount(event.params.to,event);
    let nft = createAndGetNFT(event.address,event.params.tokenId,event);
    nft.type = "721";

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
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
    fromUserNftBalance.tokenID = event.params.tokenId;
    fromUserNftBalance.value = ZERO_BI;

    if (toUserNftBalance == null) {
        toUserNftBalance = new Balance(toUserNftId);
        toUserNftBalance.account = toUser.id;
        toUserNftBalance.value = ZERO_BI;
        toUserNftBalance.nft = nft.id;
        toUserNftBalance.createdAt = event.block.timestamp;
        toUserNftBalance.updatedAt = event.block.timestamp;
    }
    toUserNftBalance.tokenID = event.params.tokenId;
    toUserNftBalance.value = ONE_BI;

    //更新时间戳
    nft.updatedAt = event.block.timestamp;
    fromUserNftBalance.updatedAt = event.block.timestamp;
    fromUserNftBalance.updatedAt = event.block.timestamp;

    nft.save();
    toUserNftBalance.save();
    toUserNftBalance.save();
}

export function handleDODONFTMint(event: DODONFTMint): void {

}

export function handleDODONFTBurn(event: DODONFTBurn): void {

}
