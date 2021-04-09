import {OrderHistory, TokenDayData, IncentiveRewardHistory, Pair, Token} from "../../types/dodoex/schema"
import {OrderHistory as OrderHistoryV2} from "../../types/dodoex/DODOV2Proxy02/DODOV2Proxy02"
import {
    createToken,
    createUser,
    ZERO_BD,
    ONE_BI,
    convertTokenToDecimal,
    getDODOZoo, updatePairTraderCount,
} from "./helpers"
import {SOURCE_SMART_ROUTE} from "../constant";
import {Address, BigInt, store} from '@graphprotocol/graph-ts'
import {trimTokenDayData, updateTokenDayData} from "./dayUpdates";
import {
    calculateUsdVolume,
    updatePrice
} from "./pricing"

export function handleOrderHistory(event: OrderHistoryV2): void {
    let user = createUser(event.transaction.from, event);
    let fromToken = createToken(event.params.fromToken, event);
    let toToken = createToken(event.params.toToken, event);
    let dealedFromAmount = convertTokenToDecimal(event.params.fromAmount, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.returnAmount, toToken.decimals);

    let trim = false;
    let volumeUSD = calculateUsdVolume(fromToken as Token, toToken as Token, dealedFromAmount, dealedToAmount);
    if (volumeUSD.equals(ZERO_BD)) {
        fromToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedFromAmount);
        toToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedToAmount);
    }

    //1、更新用户交易数据(用户的交易次数在下层)
    user.txCount = user.txCount.plus(ONE_BI);
    user.save();

    //2、更新两个token的数据
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);

    toToken.tradeVolume = toToken.tradeVolume.plus(dealedToAmount);
    toToken.txCount = toToken.txCount.plus(ONE_BI);

    //3、trim
    for (let i = BigInt.fromI32(0); i.lt(event.logIndex); i = i.plus(ONE_BI)) {
        let orderHistoryAboveID = event.transaction.hash.toHexString().concat("-").concat(i.toString());
        let orderHistoryAbove = OrderHistory.load(orderHistoryAboveID);
        if (orderHistoryAbove != null) {
            trimTokenDayData(createToken(Address.fromString(orderHistoryAbove.fromToken), event), orderHistoryAbove.amountIn, orderHistoryAbove.fromToken === fromToken.id ? ZERO_BD : orderHistoryAbove.amountIn, event);
            trimTokenDayData(createToken(Address.fromString(orderHistoryAbove.toToken), event), orderHistoryAbove.amountOut, orderHistoryAbove.toToken === toToken.id ? ZERO_BD : orderHistoryAbove.amountOut, event);

            store.remove("OrderHistory", event.transaction.hash.toHexString().concat("-").concat(i.toString()));
            trim = true;
        }
    }
    if (!trim) {
        fromToken.volumeUSD = fromToken.volumeUSD.plus(volumeUSD);
        toToken.volumeUSD = toToken.volumeUSD.plus(volumeUSD);
    }

    fromToken.save();
    toToken.save();

    //4、更OrderHistory数据
    let orderHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let orderHistory = OrderHistory.load(orderHistoryID);
    if (orderHistory == null) {
        orderHistory = new OrderHistory(orderHistoryID);
        orderHistory.source = SOURCE_SMART_ROUTE;
        orderHistory.hash = event.transaction.hash.toHexString();
        orderHistory.timestamp = event.block.timestamp;
        orderHistory.block = event.block.number;
        orderHistory.fromToken = fromToken.id;
        orderHistory.toToken = toToken.id;
        orderHistory.from = event.transaction.from;
        orderHistory.to = event.params.sender;
        orderHistory.sender = event.params.sender;
        orderHistory.amountIn = dealedFromAmount;
        orderHistory.amountOut = dealedToAmount;
        orderHistory.logIndex = event.transaction.index;
        orderHistory.volumeUSD = volumeUSD;

        let incentiveRewardHistory = IncentiveRewardHistory.load(event.transaction.hash.toHexString());
        if (incentiveRewardHistory != null) {
            orderHistory.tradingReward = incentiveRewardHistory.amount;
        } else {
            orderHistory.tradingReward = ZERO_BD;
        }

    }
    orderHistory.save();

    //更新token统计信息
    let fromTokenDayData = updateTokenDayData(fromToken, event);
    let toTokenDayData = updateTokenDayData(toToken, event);
    fromTokenDayData.volume = fromTokenDayData.volume.plus(dealedFromAmount);
    toTokenDayData.volume = toTokenDayData.volume.plus(dealedToAmount);
    fromTokenDayData.save();
    toTokenDayData.save();

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();
}
