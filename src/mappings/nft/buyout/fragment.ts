import {Buyout, Redeem} from "../../../types/nft/templates/Fragment/Fragment"
import {NftCollateralVault, Fragment, AggregateFragment} from "../../../types/nft/schema"
import {ZERO_BI} from "../helpers";

export function handleBuyout(event: Buyout): void {
    let fragment = Fragment.load(event.address.toHexString());
    fragment.isBuyOut = true;
    fragment.preVault = fragment.vault;
    fragment.buyoutTimestamp = event.block.timestamp;
    fragment.updatedAt = event.block.timestamp;
    fragment.save();

    let vault = NftCollateralVault.load(fragment.vault);
    if (vault !== null) {
        vault.owner = event.params.newOwner;
        vault.updatedAt = event.block.timestamp;
        vault.save();
    }


    let aggregateFragment = AggregateFragment.load(event.address.toHexString());
    if (aggregateFragment !== null) {
        aggregateFragment.nftCount = ZERO_BI;
        aggregateFragment.updatedAt = event.block.timestamp;
        aggregateFragment.save();
    }

}

export function handleRedeem(event: Redeem): void {

}