import {
    CreateLiteNFTPool,
    CreateFilterV1,
    CreateNFTPool,
    Erc721toErc20,
    Erc721In,
    Erc721TargetOut,
    Erc1155TargetOut,
    Erc721RandomOut,
    Erc1155RandomOut,
    ChangeMaintainer,
    ChangeContoller,
    ChangeFilterAdminTemplate
} from "../../../types/nft/DODONFTPoolProxy/DODONFTPoolProxy"
import {
    Filter,
    FilterAdmin,
    Controller,
    PoolTradeHistory,
    FilterNft,
    AggregateFragment
} from "../../../types/nft/schema"
import {FilterAdmin as FilterAdminTemplates} from "../../../types/nft/templates"
import * as helper from "./helper"
import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts"
import {convertTokenToDecimal, BI_18} from "../helpers"

function createNewFilterAdmin(newFilterAdmin: Address, filterAdminOwner: Address, event: ethereum.Event): FilterAdmin {
    let filterAdmin = new FilterAdmin(newFilterAdmin.toHexString());
    filterAdmin.owner = filterAdminOwner;
    filterAdmin.name = helper.getName(newFilterAdmin);
    filterAdmin.symbol = helper.getSymbol(newFilterAdmin);
    filterAdmin.feeRate = helper.getFeeRate(newFilterAdmin);
    filterAdmin.initSupply = helper.getInitSupply(newFilterAdmin);
    filterAdmin.maintainer = helper.getMaintainer(newFilterAdmin);
    filterAdmin.controller = helper.getController(newFilterAdmin);
    filterAdmin.createdAt = event.block.timestamp;
    filterAdmin.updatedAt = event.block.timestamp;
    filterAdmin.save();

    let aggregateFragment = AggregateFragment.load(newFilterAdmin.toHexString());
    if (aggregateFragment == null) {
        aggregateFragment = new AggregateFragment(newFilterAdmin.toHexString())
        aggregateFragment.filterAdmin = filterAdmin.id;
        aggregateFragment.timestamp = event.block.timestamp;
        aggregateFragment.createdAt = event.block.timestamp;
        aggregateFragment.updatedAt = event.block.timestamp;
        aggregateFragment.type = "POOL"
        aggregateFragment.creator = event.transaction.from;
        aggregateFragment.save();
    }

    return filterAdmin;
}

function createNewFilter(filterAddress: Address, key: BigInt, admin: Address, collection: Address, event: ethereum.Event): Filter {
    let filter = new Filter(filterAddress.toHexString());
    filter.key = key;
    filter.admin = admin.toHexString();
    filter.collection = collection;
    filter.startId = helper.getIdStart(filterAddress);
    filter.endId = helper.getIdEnd(filterAddress);
    filter.minAmount = helper.getMinNFTAmount(filterAddress);
    filter.maxAmount = helper.getMaxNFTAmount(filterAddress);
    filter.spreadIds = [];
    filter.createdAt = event.block.timestamp;
    filter.updatedAt = event.block.timestamp;
    filter.save();
    return filter;
}

export function handleCreateLiteNFTPool(event: CreateLiteNFTPool): void {
    let filterAdmin = FilterAdmin.load(event.params.newFilterAdmin.toHexString());
    if (filterAdmin == null) {
        filterAdmin = createNewFilterAdmin(event.params.newFilterAdmin, event.params.newFilterAdmin, event);
        filterAdmin.createdAt = event.block.timestamp;
        filterAdmin.updatedAt = event.block.timestamp;
        filterAdmin.save();
    }

    FilterAdminTemplates.create(event.params.newFilterAdmin);
}

export function handleCreateNFTPool(event: CreateNFTPool): void {
    createNewFilterAdmin(event.params.newFilterAdmin, event.params.filterAdminOwner, event);
}

export function handleCreateFilterV1(event: CreateFilterV1): void {
    let filter = Filter.load(event.params.newFilterV1.toHexString());
    if (filter == null) {
        createNewFilter(event.params.newFilterV1, event.params.filterTemplateKey, event.params.newFilterAdmin, event.params.nftCollection, event);
    }
}

export function handleErc721In(event: Erc721In): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;
    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "IN"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.received, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;
    poolTradeHistory.save();

}

export function handleErc1155In(event: Erc721In): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;

    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "IN"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.received, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;

    poolTradeHistory.save();

}

export function handleErc721TargetOut(event: Erc721TargetOut): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;

    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT"
    poolTradeHistory.mode = "TARGET"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paid, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;

    poolTradeHistory.save();

}

export function handleErc721RandomOut(event: Erc721RandomOut): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;

    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT"
    poolTradeHistory.mode = "RANDOM"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paid, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;

    poolTradeHistory.save();

}

export function handleErc1155TargetOut(event: Erc1155TargetOut): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;

    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT"
    poolTradeHistory.mode = "TARGET"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paid, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;

    poolTradeHistory.save();

}

export function handleErc1155RandomOut(event: Erc1155RandomOut): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;

    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT"
    poolTradeHistory.mode = "RANDOM"
    poolTradeHistory.filter = event.params.filter.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.to;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paid, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;

    poolTradeHistory.save();

}

export function handleChangeMaintainer(event: ChangeMaintainer): void {

}

export function handleChangeContoller(event: ChangeMaintainer): void {

}

export function handleChangeFilterAdminTemplate(event: ChangeMaintainer): void {

}

export function handleErc721toErc20(event: Erc721toErc20): void {

}


