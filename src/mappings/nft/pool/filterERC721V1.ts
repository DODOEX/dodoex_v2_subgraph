import {Address, store} from "@graphprotocol/graph-ts"
import {
    NftIn,
    TargetOut,
    RandomOut,
    EmergencyWithdraw,
    NftInOrder,
    TargetOutOrder,
    RandomOutOrder,
    ChangeFilterName,
    ChangeNFTAmountRange,
    ChangeTokenIdMap,
    ChangeTokenIdRange
} from "../../../types/nft/templates/FilterERC721V1/FilterERC721V1"
import {
    Nft,
    Filter,
    FilterNft,
    PoolTradeHistory,
    TradeHistoryTransferDetail,
    FilterSpreadId
} from "../../../types/nft/schema"
import {BI_18, convertTokenToDecimal, createAndGetNFT, ONE_BI, ZERO_BI} from "../helpers"

export function handleNftIn(event: NftIn): void {
    const filter = Filter.load(event.address.toHexString());
    const nft = createAndGetNFT(Address.fromString(filter.collection.toHexString()), event.params.tokenId, event);

    const filterNftId = filter.id.concat("-").concat(nft.id);
    let filterNft = FilterNft.load(filterNftId);
    if (filterNft == null) {
        filterNft = new FilterNft(filterNftId);
        filterNft.nft = nft.id;
        filterNft.filter = filter.id;
        filterNft.amount = ONE_BI;
        filterNft.createdAt = event.block.timestamp;
        filterNft.updatedAt = event.block.timestamp;
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filterNft.save();
    }

    let tradeHistoryTransferDetailId = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let tradeHistoryTransferDetail = TradeHistoryTransferDetail.load(tradeHistoryTransferDetailId);
    if (tradeHistoryTransferDetail == null) {
        tradeHistoryTransferDetail = new TradeHistoryTransferDetail(tradeHistoryTransferDetailId);
        tradeHistoryTransferDetail.hash = event.transaction.hash.toHexString();
        tradeHistoryTransferDetail.tokenId = event.params.tokenId;
        tradeHistoryTransferDetail.amount = ONE_BI;
        tradeHistoryTransferDetail.createdAt = event.block.timestamp;
        tradeHistoryTransferDetail.updatedAt = event.block.timestamp;
        tradeHistoryTransferDetail.save();
    }
    filter.save();
}

export function handleTargetOut(event: TargetOut): void {
    const filter = Filter.load(event.address.toHexString());
    const nft = createAndGetNFT(Address.fromString(filter.collection.toHexString()), event.params.tokenId, event);
    const filterNftId = filter.id.concat("-").concat(nft.id);
    let filterNft = FilterNft.load(filterNftId);
    if (filterNft != null) {
        filterNft.amount = ZERO_BI;
        filterNft.createdAt = event.block.timestamp;
        filterNft.updatedAt = event.block.timestamp;
        filterNft.save();
    }

    let tradeHistoryTransferDetailId = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let tradeHistoryTransferDetail = TradeHistoryTransferDetail.load(tradeHistoryTransferDetailId);
    if (tradeHistoryTransferDetail == null) {
        tradeHistoryTransferDetail = new TradeHistoryTransferDetail(tradeHistoryTransferDetailId);
        tradeHistoryTransferDetail.hash = event.transaction.hash.toHexString();
        tradeHistoryTransferDetail.tokenId = event.params.tokenId;
        tradeHistoryTransferDetail.amount = ONE_BI;
        tradeHistoryTransferDetail.createdAt = event.block.timestamp;
        tradeHistoryTransferDetail.updatedAt = event.block.timestamp;
        tradeHistoryTransferDetail.save();
    }

}

export function handleRandomOut(event: RandomOut): void {
    const filter = Filter.load(event.address.toHexString());
    const nft = createAndGetNFT(Address.fromString(filter.collection.toHexString()), event.params.tokenId, event);
    const filterNftId = filter.id.concat("-").concat(nft.id);
    let filterNft = FilterNft.load(filterNftId);
    if (filterNft != null) {
        filterNft.amount = ZERO_BI;
        filterNft.createdAt = event.block.timestamp;
        filterNft.updatedAt = event.block.timestamp;
        filterNft.save();
    }

    let tradeHistoryTransferDetailId = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let tradeHistoryTransferDetail = TradeHistoryTransferDetail.load(tradeHistoryTransferDetailId);
    if (tradeHistoryTransferDetail == null) {
        tradeHistoryTransferDetail = new TradeHistoryTransferDetail(tradeHistoryTransferDetailId);
        tradeHistoryTransferDetail.hash = event.transaction.hash.toHexString();
        tradeHistoryTransferDetail.tokenId = event.params.tokenId;
        tradeHistoryTransferDetail.amount = ONE_BI;
        tradeHistoryTransferDetail.createdAt = event.block.timestamp;
        tradeHistoryTransferDetail.updatedAt = event.block.timestamp;
        tradeHistoryTransferDetail.save();
    }
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
    const filter = Filter.load(event.address.toHexString());
    const nft = createAndGetNFT(Address.fromString(filter.collection.toHexString()), event.params.tokenId, event);
    const filterNftId = filter.id.concat("-").concat(nft.id);
    let filterNft = FilterNft.load(filterNftId);
    if (filterNft != null) {
        filterNft.amount = ZERO_BI;
        filterNft.createdAt = event.block.timestamp;
        filterNft.updatedAt = event.block.timestamp;
        filterNft.save();
    }

    let tradeHistoryTransferDetailId = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let tradeHistoryTransferDetail = TradeHistoryTransferDetail.load(tradeHistoryTransferDetailId);
    if (tradeHistoryTransferDetail == null) {
        tradeHistoryTransferDetail = new TradeHistoryTransferDetail(tradeHistoryTransferDetailId);
        tradeHistoryTransferDetail.hash = event.transaction.hash.toHexString();
        tradeHistoryTransferDetail.tokenId = event.params.tokenId;
        tradeHistoryTransferDetail.amount = ONE_BI;
        tradeHistoryTransferDetail.createdAt = event.block.timestamp;
        tradeHistoryTransferDetail.updatedAt = event.block.timestamp;
        tradeHistoryTransferDetail.save();
    }
}

export function handleNftInOrder(event: NftInOrder): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;
    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "IN"
    poolTradeHistory.filter = event.address.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.user;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.receiveAmount, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;
    poolTradeHistory.save();
}

export function handleTargetOutOrder(event: TargetOutOrder): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;
    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT";
    poolTradeHistory.mode = "TARGET";
    poolTradeHistory.filter = event.address.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.user;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paidAmount, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;
    poolTradeHistory.save();
}

export function handleRandomOutOrder(event: RandomOutOrder): void {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let poolTradeHistory = PoolTradeHistory.load(id);
    if (poolTradeHistory == null) {
        poolTradeHistory = new PoolTradeHistory(id);
        poolTradeHistory.createdAt = event.block.timestamp;
    }
    poolTradeHistory.hash = event.transaction.hash.toHexString();
    poolTradeHistory.direction = "OUT";
    poolTradeHistory.mode = "RANDOM";
    poolTradeHistory.filter = event.address.toHexString();
    poolTradeHistory.from = event.transaction.from;
    poolTradeHistory.to = event.params.user;
    poolTradeHistory.amount = convertTokenToDecimal(event.params.paidAmount, BI_18);
    poolTradeHistory.updatedAt = event.block.timestamp;
    poolTradeHistory.save();
}

export function handleChangeFilterName(event: ChangeFilterName): void {
    let filter = Filter.load(event.address.toHexString());
    if (filter != null) {
        filter.name = event.params.newFilterName;
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filter.save();
    }
}

export function handleChangeNFTAmountRange(event: ChangeNFTAmountRange): void {
    let filter = Filter.load(event.address.toHexString());
    if (filter != null) {
        filter.minAmount = event.params.minNFTAmount;
        filter.maxAmount = event.params.maxNFTAmount;
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filter.save();
    }
}

export function handleChangeTokenIdRange(event: ChangeTokenIdRange): void {
    let filter = Filter.load(event.address.toHexString());
    if (filter != null) {
        filter.startId = event.params.nftIdStart;
        filter.endId = event.params.nftIdEnd;
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filter.save();
    }
}

export function handleChangeTokenIdMap(event: ChangeTokenIdMap): void {
    let filter = Filter.load(event.address.toHexString());
    let filterSpreadId = FilterSpreadId.load(event.address.toHexString().concat("-").concat(event.params.tokenIds.toString()));

    if (filter != null) {

        if (event.params.isRegistered == true) {
            if (filterSpreadId == null) {
                filterSpreadId = new FilterSpreadId(event.address.toHexString().concat("-").concat(event.params.tokenIds.toString()));
                filterSpreadId.filter = event.address.toHexString();
                filterSpreadId.tokenId = event.params.tokenIds;
            }
            filterSpreadId.createdAt = event.block.timestamp;
            filterSpreadId.updatedAt = event.block.timestamp;
            filterSpreadId.save();
        } else {
            if (filterSpreadId != null) {
                store.remove("FilterSpreadId", event.address.toHexString().concat("-").concat(event.params.tokenIds.toString()))
            }
        }
        filter.createdAt = event.block.timestamp;
        filter.updatedAt = event.block.timestamp;
        filter.save();
    }
}