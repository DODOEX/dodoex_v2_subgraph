import {FilterAdmin} from "../../../types/nft/schema"
import {ChangeFeeRate} from "../../../types/nft/DODONFTPoolProxy/FilterAdmin"

export function handleChangeFeeRate(event: ChangeFeeRate): void {
    let filterAdmin = FilterAdmin.load(event.address.toHexString());
    if (filterAdmin != null) {
        filterAdmin.feeRate = event.params.fee;
        filterAdmin.save();
    }
}
