import {Address} from "@graphprotocol/graph-ts"
import {ChangeFilterName} from "../../../types/nft/templates/FilterERC721V1/FilterERC721V1"
import {Filter} from "../../../types/nft/schema"

export function handleChangeFilterName(event: ChangeFilterName): void {
    let filter = Filter.load(event.address.toHexString());
    if (filter != null) {
        filter.name = event.params.newFilterName;
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filter.save();
    }
}
