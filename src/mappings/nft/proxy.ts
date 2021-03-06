import {VaultNft, NftCollateralVault, Fragment} from "../../types/nft/schema"
import {CreateNFTCollateralVault, CreateFragment} from "../../types/nft/DODONFTProxy/DODONFTProxy"
import {createAndGetFragment} from "./helpers"
import {NFTCollateralVault as NFTCollateralVaultTemplate,Fragment as FragmentTemplate} from "../../types/nft/templates"

export function handleCreateNFTCollateralVault(event: CreateNFTCollateralVault): void {
    let vault = NftCollateralVault.load(event.params.vault.toHexString());

    if (vault == null) {
        vault = new NftCollateralVault(event.params.vault.toHexString());
        vault.creator = event.params.creator.toHexString();
        vault.name = event.params.name;
        vault.baseURI = event.params.baseURI;
        vault.save();
    }
    NFTCollateralVaultTemplate.create(event.params.vault)
}

export function handleCreateFragment(event: CreateFragment): void {
    let vault = NftCollateralVault.load(event.params.vault.toHexString());
    if (vault == null) return;
    let fragment = createAndGetFragment(event.params.fragment);
    fragment.vault = event.params.vault.toHexString();
    fragment.dvm = event.params.dvm.toHexString();
    fragment.save();
    FragmentTemplate.create(event.params.fragment);
}