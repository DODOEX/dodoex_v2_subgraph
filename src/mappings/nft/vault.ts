import {VaultNft} from "../../types/nft/schema";
import {
    AddNftToken,
    RemoveNftToken
} from "../../types/nft/templates/NFTCollateralVault/NFTCollateralVault"

export function handleAddNftToken(event: AddNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft == null) {
        vaultNft = new VaultNft(vaultNftID);
        vaultNft.nft = event.params.nftContract.toHexString();
        vaultNft.vault = event.address.toHexString();
        vaultNft.tokenID = event.params.tokenId;
        vaultNft.amount = event.params.amount;
    } else {
        vaultNft.amount = vaultNft.amount.plus(event.params.amount);
    }
    vaultNft.save();
}

export function handleRemoveNftToken(event: RemoveNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft != null) {
        vaultNft.amount = vaultNft.amount.minus(event.params.amount);
    }
    vaultNft.save();
}
