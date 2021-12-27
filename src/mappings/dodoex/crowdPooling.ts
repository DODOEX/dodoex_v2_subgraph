import {
    CrowdPooling,
    BidPosition,
    BidHistory,
    Pair
} from "../../types/dodoex/schema"
import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {
    ONE_BI,
    ZERO_BD,
    ZERO_BI,
    convertTokenToDecimal,
    createToken,
    createUser,
    getDODOZoo,
    updateUserDayDataAndDodoDayData
} from './helpers'
import {Bid, Cancel, Settle, Claim, CP} from "../../types/dodoex/templates/CP/CP"
import {updateCrowdPoolingDayData, updateCrowdPoolingHourData} from "./dayUpdates"
import {addTransaction} from "./transaction";
import {
    TRANSACTION_TYPE_CP_BID,
    TRANSACTION_TYPE_CP_CLAIM,
    TRANSACTION_TYPE_CP_CANCEL,
    TRANSACTION_TYPE_SWAP,
} from "../constant";

export function handleBid(event: Bid): void {
    let cp = CrowdPooling.load(event.address.toHexString());
    let token = createToken(Address.fromString(cp.quoteToken), event);
    let dealedAmount = convertTokenToDecimal(event.params.amount, token.decimals);
    cp.poolQuote = cp.poolQuote.plus(dealedAmount);
    cp.totalShares = cp.totalShares.plus(event.params.amount.toBigDecimal());

    let toUser = createUser(event.params.to, event);
    let fromUser = createUser(event.transaction.from, event);

    let newcome: boolean = false;
    //用户信息
    let bidPositionID = event.params.to.toHexString().concat("-").concat(event.address.toHexString());
    let bidPosition = BidPosition.load(bidPositionID);
    if (bidPosition == null) {
        cp.investorsCount = cp.investorsCount.plus(ONE_BI);
        newcome = true;

        bidPosition = new BidPosition(bidPositionID);
        bidPosition.cp = event.address.toHexString();
        bidPosition.user = event.params.to.toHexString();
        bidPosition.investedQuote = ZERO_BD;
        bidPosition.shares = ZERO_BD;
        bidPosition.lastTxTime = ZERO_BI;
        bidPosition.claimed = false;
    }
    bidPosition.investedQuote = dealedAmount.plus(bidPosition.investedQuote);
    bidPosition.shares = event.params.amount.minus(event.params.fee).toBigDecimal().plus(bidPosition.shares);

    //交易记录
    let bidHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let bidHistory = BidHistory.load(bidHistoryID);
    if (bidHistory == null) {
        bidHistory = new BidHistory(bidHistoryID);
        bidHistory.action = "bid";
        bidHistory.block = event.block.number;
        bidHistory.cp = event.address.toHexString();
        bidHistory.hash = event.transaction.hash.toHexString();
        bidHistory.quote = ZERO_BD;
        bidHistory.share = ZERO_BD;
        bidHistory.timestamp = event.block.timestamp;
        bidHistory.user = event.params.to.toHexString();
        bidHistory.fee = convertTokenToDecimal(event.params.fee, token.decimals);
    }
    bidHistory.quote = dealedAmount;
    bidHistory.share = event.params.amount.minus(event.params.fee).toBigDecimal();


    //更新小时统计数据
    let cpHourData = updateCrowdPoolingHourData(cp as CrowdPooling, event);
    cpHourData.investCount = cpHourData.investCount.plus(ONE_BI);
    cpHourData.investedQuote = cpHourData.investedQuote.plus(dealedAmount);
    cpHourData.poolQuote = cp.poolQuote;
    if (newcome == true) cpHourData.newcome = cpHourData.newcome.plus(ONE_BI);
    if (bidPosition.lastTxTime.lt(BigInt.fromI32(cpHourData.hour))) {
        cpHourData.investors = cpHourData.investors.plus(ONE_BI);
    }

    //更新日统计数据
    let cpDayData = updateCrowdPoolingDayData(cp as CrowdPooling, event);
    cpDayData.investCount = cpDayData.investCount.plus(ONE_BI);
    cpDayData.investedQuote = cpDayData.investedQuote.plus(dealedAmount);
    cpDayData.poolQuote = cp.poolQuote;
    if (newcome == true) cpDayData.newcome = cpDayData.newcome.plus(ONE_BI);
    if (bidPosition.lastTxTime.lt(BigInt.fromI32(cpDayData.date))) {
        cpDayData.investors = cpDayData.investors.plus(ONE_BI);
    }
    bidPosition.lastTxTime = event.block.timestamp;

    cp.updatedAt = event.block.timestamp;
    toUser.updatedAt = event.block.timestamp;
    fromUser.updatedAt = event.block.timestamp;
    bidPosition.updatedAt = event.block.timestamp;
    bidHistory.updatedAt = event.block.timestamp;
    cpDayData.updatedAt = event.block.timestamp;
    cpHourData.updatedAt = event.block.timestamp;

    fromUser.save();
    toUser.save();
    bidPosition.save();
    bidHistory.save();
    cpHourData.save();
    cpDayData.save();
    cp.save();

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.updatedAt = event.block.timestamp;
    dodoZoo.save();

    addTransaction(event, event.params.to.toHexString(), TRANSACTION_TYPE_CP_BID);
    updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_CP_BID);
}

export function handleCancel(event: Cancel): void {
    let cp = CrowdPooling.load(event.address.toHexString());
    let token = createToken(Address.fromString(cp.quoteToken), event);
    let dealedAmount = convertTokenToDecimal(event.params.amount, token.decimals);
    cp.poolQuote = cp.poolQuote.minus(dealedAmount);
    cp.totalShares = cp.totalShares.minus(event.params.amount.toBigDecimal());

    //用户信息
    let bidPositionID = event.params.to.toHexString().concat("-").concat(event.address.toHexString());
    let bidPosition = BidPosition.load(bidPositionID);
    if (bidPosition == null) {
        bidPosition = new BidPosition(bidPositionID);
        bidPosition.cp = event.address.toHexString();
        bidPosition.user = event.params.to.toHexString();
        bidPosition.investedQuote = ZERO_BD;
        bidPosition.shares = ZERO_BD;
        bidPosition.lastTxTime = ZERO_BI;
        bidPosition.claimed = false;
    }
    bidPosition.investedQuote = bidPosition.investedQuote.minus(dealedAmount);
    bidPosition.shares = bidPosition.shares.minus(event.params.amount.toBigDecimal());

    //交易记录
    let bidHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let bidHistory = BidHistory.load(bidHistoryID);
    if (bidHistory == null) {
        bidHistory = new BidHistory(bidHistoryID);
        bidHistory.action = "cancel";
        bidHistory.block = event.block.number;
        bidHistory.cp = event.address.toHexString();
        bidHistory.hash = event.transaction.hash.toHexString();
        bidHistory.quote = ZERO_BD;
        bidHistory.share = ZERO_BD;
        bidHistory.timestamp = event.block.timestamp;
        bidHistory.fee = ZERO_BD;
        bidHistory.user = event.params.to.toHexString();
    }
    bidHistory.quote = dealedAmount;
    bidHistory.share = event.params.amount.toBigDecimal();

    //更新小时统计数据
    let cpHourData = updateCrowdPoolingHourData(cp as CrowdPooling, event);
    cpHourData.investedQuote = cpHourData.investedQuote.minus(dealedAmount);
    cpHourData.poolQuote = cp.poolQuote;
    cpHourData.canceledQuote = cpHourData.canceledQuote.plus(dealedAmount);

    //更新日统计数据
    let cpDayData = updateCrowdPoolingDayData(cp as CrowdPooling, event);
    cpDayData.investedQuote = cpDayData.investedQuote.minus(dealedAmount);
    cpDayData.poolQuote = cp.poolQuote;
    cpDayData.canceledQuote = cpDayData.canceledQuote.plus(dealedAmount);

    cp.updatedAt = event.block.timestamp;
    bidPosition.updatedAt = event.block.timestamp;
    bidHistory.updatedAt = event.block.timestamp;
    cpDayData.updatedAt = event.block.timestamp;
    cpHourData.updatedAt = event.block.timestamp;

    cpHourData.save();
    cpDayData.save();
    cp.save();
    bidPosition.save();
    bidHistory.save();

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.updatedAt = event.block.timestamp;
    dodoZoo.save();

    addTransaction(event, event.params.to.toHexString(), TRANSACTION_TYPE_CP_CANCEL);
    updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_CP_CANCEL);
}

export function handleSettle(event: Settle): void {
    let cp = CrowdPooling.load(event.address.toHexString());

    let cpContrct = CP.bind(event.address);

    let dvmAddress = cpContrct._POOL_();

    let pair = Pair.load(dvmAddress.toHexString());
    if (pair != null) {
        pair.creator = cp.creator;
        cp.dvm = pair.id;
        pair.save();
    }
    cp.updatedAt = event.block.timestamp;
    cp.settled = true;
    cp.liquidator = event.transaction.from;

    cp.save();

}

export function handleClaim(event: Claim): void {
    //用户信息
    let bidPositionID = event.params.user.toHexString().concat("-").concat(event.address.toHexString());
    let bidPosition = BidPosition.load(bidPositionID);
    if (bidPosition !== null) {
        bidPosition.claimed = true;
        bidPosition.updatedAt = event.block.timestamp;
        bidPosition.save();
        addTransaction(event, event.params.user.toHexString(), TRANSACTION_TYPE_CP_CLAIM);
        updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_CP_CLAIM);
    }
}
