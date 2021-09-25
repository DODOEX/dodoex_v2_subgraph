import {FilterAdmin} from "../../../types/nft/schema"
import {ChangeFeeRate,OwnershipTransferred} from "../../../types/nft/DODONFTPoolProxy/FilterAdmin"

export function handleChangeFeeRate(event: ChangeFeeRate): void {
    let filterAdmin = FilterAdmin.load(event.address.toHexString());
    if (filterAdmin != null) {
        filterAdmin.feeRate = event.params.fee;
        filterAdmin.save();
    }
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void{
    let filterAdmin = FilterAdmin.load(event.address.toHexString());
    if (filterAdmin != null) {
        filterAdmin.owner = event.params.newOwner;
        filterAdmin.save();
    }
}


