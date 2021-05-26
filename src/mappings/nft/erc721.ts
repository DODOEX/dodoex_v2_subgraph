import {Nft, Fragment, User, UserNft} from "../../types/nft/schema";
import {Address} from "@graphprotocol/graph-ts";
import {Transfer} from "../../types/nft/templates/InitializableERC721/InitializableERC721"
import {createUser, ZERO_BI, ONE_BI, createAndGetNFT} from "./helpers";

export function handleTransfer(event: Transfer): void {
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let nft = createAndGetNFT(event.address);

    let fromUserNftId = event.params.from.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let toUserNftId = event.params.to.toHexString().concat("-").concat(event.address.toHexString()).concat(event.params.tokenId.toString());
    let fromUserNft = UserNft.load(fromUserNftId);
    let toUserNft = UserNft.load(toUserNftId);

    if (fromUserNft == null) {
        fromUserNft = new UserNft(fromUserNftId);
        fromUserNft.owner = fromUser.id;
        fromUserNft.nft = nft.id;
    }
    fromUserNft.tokenID = event.params.tokenId;
    fromUserNft.amount = ZERO_BI;
    fromUserNft.save();

    if (toUserNft == null) {
        toUserNft = new UserNft(toUserNftId);
        toUserNft.owner = toUser.id;
        toUserNft.nft = nft.id;
    }
    toUserNft.tokenID = event.params.tokenId;
    toUserNft.amount = ONE_BI;
    toUserNft.save();
}