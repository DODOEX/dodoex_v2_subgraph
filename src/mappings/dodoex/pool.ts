import {BigInt, BigDecimal, ethereum, log} from '@graphprotocol/graph-ts'
import {
    OrderHistory,
    Token,
    Pair,
    Swap,
    LiquidityPosition,
    LpToken,
    LiquidityHistory,
} from "../../types/dodoex/schema"
import {
    createLpToken,
    createUser,
    ZERO_BD,
    ONE_BI,
    ZERO_BI,
    convertTokenToDecimal,
    getPMMState,
    BI_18,
    updatePairTraderCount,
    getDODOZoo,
    updateStatistics,
    updateUserDayDataAndDodoDayData,
    updateTokenTraderCount
} from "./helpers"
import {DODOSwap, BuyShares, SellShares, Transfer} from "../../types/dodoex/templates/DVM/DVM"
import {LpFeeRateChange, DPP} from "../../types/dodoex/templates/DPP/DPP"
import {DVM__getPMMStateResultStateStruct} from "../../types/dodoex/DVMFactory/DVM";
import {
    calculateUsdVolume,
    updatePrice
} from "./pricing"
import {addToken, addTransaction, addVolume} from "./transaction";
import {increaseVolumeAndFee} from "./dayUpdates"

import {
    SMART_ROUTE_ADDRESSES,
    ADDRESS_ZERO,
    SOURCE_POOL_SWAP,
    TYPE_DPP_POOL,
    TRANSACTION_TYPE_SWAP,
    TRANSACTION_TYPE_LP_ADD,
    TRANSACTION_TYPE_LP_REMOVE, TRANSACTION_TYPE_CP_CLAIM
} from "../constant"


export function handleDODOSwap(event: DODOSwap): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let user = createUser(event.transaction.from, event);
    let fromToken = Token.load(event.params.fromToken.toHexString());
    let toToken = Token.load(event.params.toToken.toHexString());
    let dealedFromAmount = convertTokenToDecimal(event.params.fromAmount, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.toAmount, toToken.decimals);
    let pmmState = getPMMState(event.address);

    let untrackedBaseVolume = ZERO_BD;
    let untrackedQuoteVolume = ZERO_BD;

    let baseToken: Token, quoteToken: Token, baseVolume: BigDecimal, quoteVolume: BigDecimal, baseLpFee: BigDecimal,
        quoteLpFee: BigDecimal, lpFeeUsdc: BigDecimal;
    if (fromToken.id == pair.baseToken) {
        baseToken = fromToken as Token;
        quoteToken = toToken as Token;
        baseVolume = dealedFromAmount;
        quoteVolume = dealedToAmount;

        baseLpFee = ZERO_BD;
        quoteLpFee = quoteVolume.times(pair.lpFeeRate);
    } else {
        baseToken = toToken as Token;
        quoteToken = fromToken as Token;
        baseVolume = dealedToAmount;
        quoteVolume = dealedFromAmount;

        baseLpFee = baseVolume.times(pair.lpFeeRate);
        quoteLpFee = ZERO_BD;
    }

    //1、update pair basic info
    pair.baseReserve = convertTokenToDecimal(pmmState.B, baseToken.decimals);
    pair.quoteReserve = convertTokenToDecimal(pmmState.Q, quoteToken.decimals);
    pair.i = pmmState.i;
    pair.k = pmmState.K;
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseVolume);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(quoteVolume);
    pair.feeBase = pair.feeBase.plus(baseLpFee);
    pair.feeQuote = pair.feeQuote.plus(quoteLpFee);

    //price update
    updatePrice(pair as Pair, event.block.timestamp);
    if (baseVolume.gt(ZERO_BD)) {
        pair.lastTradePrice = quoteVolume.div(baseVolume);

        if (quoteToken.usdPrice.gt(ZERO_BD)) {
            baseToken.usdPrice = quoteToken.usdPrice.times(pair.lastTradePrice);
            baseToken.priceUpdateTimestamp = event.block.timestamp;
        }

        if (quoteVolume.gt(ZERO_BD) && baseToken.usdPrice.gt(ZERO_BD)) {
            quoteToken.usdPrice = baseToken.usdPrice.times(baseVolume).div(quoteVolume);
            quoteToken.priceUpdateTimestamp = event.block.timestamp;
        }
    }

    //volume update
    let volumeUSD = calculateUsdVolume(baseToken as Token, quoteToken as Token, baseVolume, quoteVolume, event.block.timestamp);
    let feeUSD = volumeUSD.times(pair.lpFeeRate).div(BI_18.toBigDecimal())
    pair.volumeUSD = pair.volumeUSD.plus(volumeUSD);
    pair.feeUSD = pair.feeUSD.plus(feeUSD)

    if (volumeUSD.equals(ZERO_BD)) {
        pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(baseVolume);
        pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(quoteVolume);
        untrackedBaseVolume = baseVolume;
        untrackedQuoteVolume = quoteVolume;
        fromToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedFromAmount);
        toToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedToAmount);
    }
    pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(untrackedBaseVolume);
    pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(untrackedQuoteVolume);
    pair.save();

    //3、user info update
    user.txCount = user.txCount.plus(ONE_BI);
    user.save();

    //4、swap info update
    let swap = Swap.load(swapID);
    if (swap == null) {
        swap = new Swap(swapID)
        swap.hash = event.transaction.hash.toHexString();
        swap.from = event.transaction.from;
        swap.to = event.params.trader;//to address
        swap.logIndex = event.logIndex;
        swap.sender = event.params.trader;
        swap.timestamp = event.block.timestamp;
        swap.amountIn = dealedFromAmount;
        swap.amountOut = dealedToAmount;
        swap.fromToken = fromToken.id;
        swap.toToken = toToken.id;
        swap.pair = pair.id;
        swap.feeBase = baseLpFee;
        swap.feeQuote = quoteLpFee;
        swap.baseVolume = baseVolume;
        swap.quoteVolume = quoteVolume;
        swap.volumeUSD = volumeUSD;
        swap.save();
    }

    // add to OrderHistory
    let orderHistory = OrderHistory.load(swapID);
    if (SMART_ROUTE_ADDRESSES.indexOf(event.params.trader.toHexString()) == -1 && orderHistory == null) {
        log.warning(`external swap from {},hash : {}`, [event.params.trader.toHexString(), event.transaction.hash.toHexString()]);
        orderHistory = new OrderHistory(swapID);
        orderHistory.source = SOURCE_POOL_SWAP;
        orderHistory.hash = event.transaction.hash.toHexString();
        orderHistory.timestamp = event.block.timestamp;
        orderHistory.block = event.block.number;
        orderHistory.fromToken = event.params.fromToken.toHexString();
        orderHistory.toToken = event.params.toToken.toHexString();
        orderHistory.from = event.transaction.from;
        orderHistory.to = event.params.trader;
        orderHistory.sender = event.params.trader;
        orderHistory.amountIn = dealedFromAmount;
        orderHistory.amountOut = dealedToAmount;
        orderHistory.logIndex = event.logIndex;
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.volumeUSD = volumeUSD;
        orderHistory.save();

        fromToken.txCount = fromToken.txCount.plus(ONE_BI);
        fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
        fromToken.volumeUSD = fromToken.volumeUSD.plus(volumeUSD);

        toToken.txCount = toToken.txCount.plus(ONE_BI);
        toToken.tradeVolume = toToken.tradeVolume.plus(dealedFromAmount);
        toToken.volumeUSD = toToken.volumeUSD.plus(volumeUSD);
    }
    fromToken.save();
    toToken.save();

    // update unique user
    updatePairTraderCount(event.transaction.from, event.params.receiver, pair as Pair, event);

    // update DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.feeUSD = dodoZoo.feeUSD.plus(feeUSD);
    dodoZoo.save();

    //transaction
    let transaction = addTransaction(event, event.params.trader.toHexString(), TRANSACTION_TYPE_SWAP);
    addToken(transaction, baseToken);
    addToken(transaction, quoteToken);
    addVolume(transaction, volumeUSD);

    //update day datas
    updateStatistics(event, pair as Pair, baseVolume, quoteVolume, baseLpFee, quoteLpFee, untrackedBaseVolume, untrackedQuoteVolume, baseToken, quoteToken, event.params.receiver, volumeUSD);
    updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_SWAP);
    updateTokenTraderCount(event.params.fromToken, event.transaction.from, event);
    updateTokenTraderCount(event.params.toToken, event.transaction.from, event);
    increaseVolumeAndFee(event, volumeUSD, feeUSD);
}

export function handleBuyShares(event: BuyShares): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }

    let toUser = createUser(event.params.to, event);
    let fromUser = createUser(event.transaction.from, event);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);
    let pmmState = getPMMState(event.address);

    let baseAmountChange = convertTokenToDecimal(pmmState.B, baseToken.decimals).minus(pair.baseReserve);
    let quoteAmountChange = convertTokenToDecimal(pmmState.Q, quoteToken.decimals).minus(pair.quoteReserve);

    let lpToken = createLpToken(event.address, pair as Pair);

    let dealedSharesAmount = convertTokenToDecimal(event.params.increaseShares, lpToken.decimals);
    let balance = convertTokenToDecimal(event.params.totalShares, lpToken.decimals);

    //更新用户LP token信息
    let liquidityPositionID = event.params.to.toHexString().concat("-").concat(event.address.toHexString());
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.params.to.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.lastTxTime = event.block.timestamp;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    }
    liquidityPosition.liquidityTokenBalance = balance;

    //更新基础信息
    pair.baseReserve = convertTokenToDecimal(pmmState.B, baseToken.decimals);
    pair.quoteReserve = convertTokenToDecimal(pmmState.Q, quoteToken.decimals);
    pair.i = pmmState.i;
    pair.k = pmmState.K;

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);
    lpToken.totalSupply = lpToken.totalSupply.plus(event.params.increaseShares);

    //增加shares发生时的快照
    let liquidityHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let liquidityHistory = LiquidityHistory.load(liquidityHistoryID);
    if (liquidityHistory == null) {
        liquidityHistory = new LiquidityHistory(liquidityHistoryID);
        liquidityHistory.block = event.block.number;
        liquidityHistory.hash = event.transaction.hash.toHexString();
        liquidityHistory.from = event.transaction.from;
        liquidityHistory.pair = event.address.toHexString();
        liquidityHistory.timestamp = event.block.timestamp;
        liquidityHistory.user = event.params.to.toHexString();
        liquidityHistory.amount = dealedSharesAmount;
        liquidityHistory.balance = balance;
        liquidityHistory.lpToken = lpToken.id;
        liquidityHistory.type = "DEPOSIT";
        liquidityHistory.baseReserve = pair.baseReserve;
        liquidityHistory.quoteReserve = pair.quoteReserve;
        liquidityHistory.lpTokenTotalSupply = convertTokenToDecimal(lpToken.totalSupply, lpToken.decimals);
        liquidityHistory.baseAmountChange = baseAmountChange;
        liquidityHistory.quoteAmountChange = quoteAmountChange;
    }

    liquidityPosition.save();
    liquidityHistory.save();
    pair.save();
    fromUser.save();
    toUser.save();
    baseToken.save();
    quoteToken.save();
    lpToken.save();

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();

    let transaction = addTransaction(event, event.params.to.toHexString(), TRANSACTION_TYPE_LP_ADD);
    addToken(transaction, baseToken as Token);addToken(transaction, quoteToken as Token);

    updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_LP_ADD);
}

export function handleSellShares(event: SellShares): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let toUser = createUser(event.params.to, event);
    let fromUser = createUser(event.transaction.from, event);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let pmmState: DVM__getPMMStateResultStateStruct;
    pmmState = getPMMState(event.address);

    let lpToken = createLpToken(event.address, pair as Pair);

    let dealedSharesAmount = convertTokenToDecimal(event.params.decreaseShares, lpToken.decimals);
    let balance = convertTokenToDecimal(event.params.totalShares, lpToken.decimals);

    //更新用户LP token信息
    let liquidityPositionID = event.transaction.from.toHexString().concat("-").concat(event.address.toHexString());
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.transaction.from.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.lastTxTime = ZERO_BI;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    }
    liquidityPosition.liquidityTokenBalance = balance;

    //更新基础信息
    if (pmmState != null) {
        pair.baseReserve = convertTokenToDecimal(pmmState.B, baseToken.decimals);
        pair.quoteReserve = convertTokenToDecimal(pmmState.Q, quoteToken.decimals);
        pair.i = pmmState.i;
        pair.k = pmmState.K;
    }

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    lpToken.totalSupply = lpToken.totalSupply.minus(event.params.decreaseShares);
    //增加shares发生时的快照
    let liquidityHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let liquidityHistory = LiquidityHistory.load(liquidityHistoryID);
    if (liquidityHistory == null) {
        liquidityHistory = new LiquidityHistory(liquidityHistoryID);
        liquidityHistory.block = event.block.number;
        liquidityHistory.hash = event.transaction.hash.toHexString();
        liquidityHistory.from = event.transaction.from;
        liquidityHistory.pair = event.address.toHexString();
        liquidityHistory.timestamp = event.block.timestamp;
        liquidityHistory.user = event.transaction.from.toHexString();
        liquidityHistory.amount = dealedSharesAmount;
        liquidityHistory.balance = liquidityPosition.liquidityTokenBalance;
        liquidityHistory.lpToken = lpToken.id;
        liquidityHistory.type = "WITHDRAW";
        liquidityHistory.baseReserve = pair.baseReserve;
        liquidityHistory.quoteReserve = pair.quoteReserve;
        liquidityHistory.lpTokenTotalSupply = convertTokenToDecimal(lpToken.totalSupply, lpToken.decimals);
    }

    liquidityPosition.save();
    liquidityHistory.save();
    pair.save();
    fromUser.save();
    toUser.save();
    baseToken.save();
    quoteToken.save();
    lpToken.save();


    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();

    let transaction = addTransaction(event, event.params.to.toHexString(), TRANSACTION_TYPE_LP_REMOVE);
    addToken(transaction, baseToken as Token);
    addToken(transaction, quoteToken as Token);

    updateUserDayDataAndDodoDayData(event, TRANSACTION_TYPE_LP_REMOVE);
}

export function handleLpFeeRateChange(event: LpFeeRateChange): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    if (pair.type == TYPE_DPP_POOL) {
        let dpp = DPP.bind(event.address);
        pair.lpFeeRate = convertTokenToDecimal(dpp._LP_FEE_RATE_(), BigInt.fromI32(18));

        let pmmState: DVM__getPMMStateResultStateStruct;
        pmmState = getPMMState(event.address);
        let baseToken = Token.load(pair.baseToken);
        let quoteToken = Token.load(pair.quoteToken);

        pair.baseReserve = convertTokenToDecimal(pmmState.B, baseToken.decimals);
        pair.quoteReserve = convertTokenToDecimal(pmmState.Q, quoteToken.decimals);
        pair.i = pmmState.i;
        pair.k = pmmState.K;
        pair.save();
    }

}

export function handleTransfer(event: Transfer): void {

    if (event.params.to.toHexString() == ADDRESS_ZERO || event.params.from.toHexString() == ADDRESS_ZERO) {
        return;
    }

    let fromUser = createUser(event.params.from, event);
    let toUser = createUser(event.params.to, event);
    let lpToken = LpToken.load(event.address.toHexString());
    let dealedAmount = convertTokenToDecimal(event.params.amount, lpToken.decimals);

    {
        let toUserLiquidityPositionID = toUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(toUserLiquidityPositionID);
        if (position == null) {
            position = new LiquidityPosition(toUserLiquidityPositionID);
            position.pair = event.address.toHexString();
            position.user = event.params.to.toHexString();
            position.liquidityTokenBalance = ZERO_BD;
            position.lpToken = lpToken.id;
            position.lastTxTime = event.block.timestamp;
            position.liquidityTokenInMining = ZERO_BD;
        }
        position.liquidityTokenBalance = position.liquidityTokenBalance.plus(dealedAmount);
        position.save();
    }

    {
        let fromUserLiquidityPositionID = fromUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(fromUserLiquidityPositionID);
        if (position == null) {
            position = new LiquidityPosition(fromUserLiquidityPositionID);
            position.pair = event.address.toHexString();
            position.user = event.params.to.toHexString();
            position.liquidityTokenBalance = ZERO_BD;
            position.lpToken = lpToken.id;
            position.lastTxTime = ZERO_BI;
            position.liquidityTokenInMining = ZERO_BD;
        }
        position.liquidityTokenBalance = position.liquidityTokenBalance.minus(dealedAmount);
        position.save();
    }

}
