import {createAndGetNFT} from "./helpers";
import {NewERC721, NewERC1155} from "../../types/nft/NFTTokenFactory/NFTTokenFactory"

export function handleNewERC721(event: NewERC721): void {
    let nft =createAndGetNFT(event.params.erc721);
    nft.creator = event.params.creator.toHexString();
    nft.save()
}

export function handleNewERC1155(event: NewERC1155): void {
    let nft =createAndGetNFT(event.params.erc1155);
    nft.creator = event.params.creator.toHexString();
    nft.save()
}