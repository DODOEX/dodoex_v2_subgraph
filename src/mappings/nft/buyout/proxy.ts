import {AggregateFragment, NftCollateralVault} from "../../../types/nft/schema"
import {CreateNFTCollateralVault, CreateFragment} from "../../../types/nft/DODONFTProxy/DODONFTProxy"
import {createAndGetFragment, ZERO_BI} from "../helpers"
import {
    NFTCollateralVault as NFTCollateralVaultTemplate,
    Fragment as FragmentTemplate
} from "../../../types/nft/templates"
import {BigInt} from "@graphprotocol/graph-ts";

export function handleCreateNFTCollateralVault(event: CreateNFTCollateralVault): void {
    let vault = NftCollateralVault.load(event.params.vault.toHexString());

    if (vault == null) {
        vault = new NftCollateralVault(event.params.vault.toHexString());
        vault.creator = event.params.creator.toHexString();
        vault.name = event.params.name;
        vault.baseURI = event.params.baseURI;
        vault.owner = event.params.creator;
        vault.nftCount = ZERO_BI;
        vault.createdAt = event.block.timestamp;
        vault.updatedAt = event.block.timestamp;
        vault.save();
    }
    NFTCollateralVaultTemplate.create(event.params.vault);
}

export function handleCreateFragment(event: CreateFragment): void {
    let vault = NftCollateralVault.load(event.params.vault.toHexString());
    if (vault == null) return;
    vault.fragment = event.params.fragment.toHexString();
    vault.save();

    let fragment = createAndGetFragment(event.params.fragment, event);
    // fragment.vault = event.params.vault.toHexString();
    fragment.dvm = event.params.dvm.toHexString();
    fragment.vault = event.params.vault.toHexString();
    fragment.createdAt = event.block.timestamp;
    fragment.updatedAt = event.block.timestamp;
    fragment.save();

    let aggregateFragment = AggregateFragment.load(event.params.fragment.toHexString());
    if (aggregateFragment == null) {
        aggregateFragment = new AggregateFragment(event.params.fragment.toHexString())
        aggregateFragment.fragment = fragment.id;
        aggregateFragment.timestamp = event.block.timestamp;
        aggregateFragment.createdAt = event.block.timestamp;
        aggregateFragment.updatedAt = event.block.timestamp;
        aggregateFragment.creator = event.transaction.from;
        aggregateFragment.type = "BUYOUT"
        aggregateFragment.nftCount = vault.nftCount;
        aggregateFragment.save();
    }

    FragmentTemplate.create(event.params.fragment);
}
