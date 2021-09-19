import {Buyout, Redeem} from "../../../types/nft/templates/Fragment/Fragment"
import {NftCollateralVault, Fragment} from "../../../types/nft/schema"

export function handleBuyout(event: Buyout): void {
    let fragment = Fragment.load(event.address.toHexString());
    fragment.isBuyOut = true;
    fragment.updatedAt = event.block.timestamp;
    fragment.save();
}

export function handleRedeem(event: Redeem): void {

}