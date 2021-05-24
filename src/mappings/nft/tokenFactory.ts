import {createAndGetNFT} from "./helpers";
import {NewERC721, NewERC1155} from "../../types/nft/NFTTokenFactory/NFTTokenFactory"
import {InitializableERC1155 as InitializableERC1155Template,InitializableERC721 as InitializableERC721Template} from "../../types/nft/templates"

export function handleNewERC721(event: NewERC721): void {
    let nft =createAndGetNFT(event.params.erc721);
    nft.creator = event.params.creator.toHexString();
    nft.save()
    InitializableERC1155Template.create(event.params.erc721)
}

export function handleNewERC1155(event: NewERC1155): void {
    let nft =createAndGetNFT(event.params.erc1155);
    nft.creator = event.params.creator.toHexString();
    nft.save()
    InitializableERC721Template.create(event.params.erc1155);
}