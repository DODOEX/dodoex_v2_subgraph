import {VaultNft, NftCollateralVault, Fragment, AggregateFragment} from "../../../types/nft/schema";
import {
    AddNftToken,
    RemoveNftToken,
    OwnershipTransferred
} from "../../../types/nft/templates/NFTCollateralVault/NFTCollateralVault"
import {createAndGetNFT} from "../helpers"

export function handleAddNftToken(event: AddNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat("-").concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft == null) {
        vaultNft = new VaultNft(vaultNftID);
        vaultNft.nftAddress = event.params.nftContract.toHexString();
        vaultNft.nft = event.params.nftContract.toHexString().concat("-").concat(event.params.tokenId.toString());
        vaultNft.vault = event.address.toHexString();
        vaultNft.tokenID = event.params.tokenId;
        vaultNft.amount = event.params.amount;
        vaultNft.createdAt = event.block.timestamp;
    } else {
        vaultNft.amount = vaultNft.amount.plus(event.params.amount);
    }
    vaultNft.updatedAt = event.block.timestamp;
    vaultNft.save();

    let vault = NftCollateralVault.load(event.address.toHexString());
    // vault.vaultNfts.push(vaultNftID)
    vault.updatedAt = event.block.timestamp;
    vault.nftCount = event.params.amount.plus(vault.nftCount);
    vault.save();

    let nft = createAndGetNFT(event.params.nftContract, event.params.tokenId, event);
    nft.save();

    let aggregateFragment = AggregateFragment.load(vault.fragment);
    let fragment = Fragment.load(vault.fragment)
    if (fragment != null && fragment.isBuyOut !== true) {
        aggregateFragment.nftCount = vault.nftCount;
        aggregateFragment.updatedAt = event.block.timestamp;
        aggregateFragment.save();
    }

}

export function handleRemoveNftToken(event: RemoveNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat("-").concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft != null) {
        vaultNft.amount = vaultNft.amount.minus(event.params.amount);
        vaultNft.updatedAt = event.block.timestamp;
    }
    vaultNft.save();

    let nft = createAndGetNFT(event.params.nftContract, event.params.tokenId, event);
    nft.updatedAt = event.block.timestamp;
    nft.save();

    let vault = NftCollateralVault.load(event.address.toHexString());
    vault.nftCount = vault.nftCount.minus(event.params.amount);
    vault.updatedAt = event.block.timestamp;
    vault.save();

    let aggregateFragment = AggregateFragment.load(vault.fragment);
    let fragment = Fragment.load(vault.fragment)
    if (fragment != null && fragment.isBuyOut !== true) {
        aggregateFragment.nftCount = vault.nftCount;
        aggregateFragment.updatedAt = event.block.timestamp;
        aggregateFragment.save();
    }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let vault = NftCollateralVault.load(event.address.toHexString());
    vault.owner = event.params.newOwner;
    vault.updatedAt = event.block.timestamp;
    vault.save()
}
