import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token, Pair, Swap, User, LiquidityPosition, LpToken, LiquidityHistory} from "../types/schema"
import {
    createLpToken,
    createUser,
    ZERO_BD,
    ONE_BI,
    convertTokenToDecimal,
    getPMMState,
    SOURCE_POOL_SWAP,
    BI_18,
    updatePairTraderCount,
    getDODOZoo, TYPE_DPP_POOL,
} from "./helpers"
import {DODOSwap, BuyShares, SellShares,Transfer} from "../types/templates/DVM/DVM"
import {LpFeeRateChange,DPP} from "../types/templates/DPP/DPP"
import {updatePairDayData, updateTokenDayData} from "./dayUpdates"
import {getUSDCPrice} from "./pricing"
import {DVM__getPMMStateResultStateStruct} from "../types/DVMFactory/DVM";

import {
    SMART_ROUTE_ADDRESSES,
    ADDRESS_ZERO
} from "./constant"

export function handleDODOSwap(event: DODOSwap): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    let user = createUser(event.transaction.from);
    let fromToken = Token.load(event.params.fromToken.toHexString());
    let toToken = Token.load(event.params.toToken.toHexString());
    let dealedFromAmount = convertTokenToDecimal(event.params.fromAmount, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.toAmount, toToken.decimals);
    let pmmState = getPMMState(event.address);
    let fromPrice = getUSDCPrice(pair as Pair, true,event.block.number);
    let toPrice = getUSDCPrice(pair as Pair, false,event.block.number);

    let untrackedBaseVolume = ZERO_BD;
    let untrackedQuoteVolume = ZERO_BD;

    let baseToken: Token, quoteToken: Token, baseVolume: BigDecimal, quoteVolume: BigDecimal,baseLpFee: BigDecimal,quoteLpFee: BigDecimal,lpFeeUsdc: BigDecimal;
    if (fromToken.id == pair.baseToken) {
        baseToken = fromToken as Token;
        quoteToken = toToken as Token;
        baseVolume = dealedFromAmount;
        quoteVolume = dealedToAmount;

        baseLpFee = ZERO_BD;
        quoteLpFee = quoteVolume.times(pair.lpFeeRate).div(BI_18.toBigDecimal());

        if(fromPrice.equals(ZERO_BD)){
            untrackedBaseVolume=dealedFromAmount;
        }
        if(toPrice.equals(ZERO_BD)){
            untrackedQuoteVolume = dealedToAmount;
        }
    } else {
        baseToken = toToken as Token;
        quoteToken = fromToken as Token;
        baseVolume = dealedToAmount;
        quoteVolume = dealedFromAmount;

        baseLpFee = baseVolume.times(pair.lpFeeRate).div(BI_18.toBigDecimal());
        quoteLpFee = ZERO_BD;

        if(fromPrice.equals(ZERO_BD)){
            untrackedBaseVolume=dealedToAmount;
        }
        if(toPrice.equals(ZERO_BD)){
            untrackedQuoteVolume=dealedFromAmount;
        }
    }

    let swappedUSDC = dealedFromAmount.times(fromPrice).plus(dealedToAmount.times(toPrice));
    lpFeeUsdc = swappedUSDC.times(pair.lpFeeRate).div(BI_18.toBigDecimal());

    //1、更新pair
    pair.baseReserve = convertTokenToDecimal(pmmState.B, baseToken.decimals);
    pair.quoteReserve = convertTokenToDecimal(pmmState.Q, quoteToken.decimals);
    pair.i = pmmState.i;
    pair.k = pmmState.K;
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseVolume);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(quoteVolume);
    pair.tradeVolumeUSDC = pair.tradeVolumeUSDC.plus(swappedUSDC);
    pair.baseLpFee = pair.baseLpFee.plus(baseLpFee);
    pair.quoteLpFee = pair.quoteLpFee.plus(quoteLpFee);
    pair.lpFeeUSDC = lpFeeUsdc;
    pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(untrackedBaseVolume);
    pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(untrackedQuoteVolume);
    pair.save();

    //2、更新两个token的记录数据
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
    fromToken.tradeVolumeUSDC = fromToken.tradeVolumeUSDC.plus(dealedFromAmount.times(fromPrice));
    fromToken.priceUSDC = fromPrice;
    fromToken.feeUSDC = lpFeeUsdc.div(BigDecimal.fromString("2"));
    if(fromPrice.equals(ZERO_BD)){
        fromToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedFromAmount);
    }
    fromToken.save();

    toToken.txCount = toToken.txCount.plus(ONE_BI);
    toToken.tradeVolume = toToken.tradeVolume.plus(dealedFromAmount);
    toToken.tradeVolumeUSDC = toToken.tradeVolumeUSDC.plus(dealedToAmount.times(toPrice));
    toToken.priceUSDC = toPrice;
    toToken.feeUSDC = lpFeeUsdc.div(BigDecimal.fromString("2"));
    if(toPrice.equals(ZERO_BD)){
        toToken.untrackedVolume = toToken.untrackedVolume.plus(dealedToAmount);
    }
    toToken.save();

    //3、更新用户信息
    user.txCount = user.txCount.plus(ONE_BI);
    user.usdcSwapped = user.usdcSwapped.plus(swappedUSDC);
    user.save();

    //4、增加swap条目
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
        swap.amountUSDC = swappedUSDC;
        swap.fromToken = fromToken.id;
        swap.toToken = toToken.id;
        swap.pair = pair.id;
        swap.baseLpFee = baseLpFee;
        swap.quoteLpFee = quoteLpFee;
        swap.lpFeeUSDC = lpFeeUsdc.div(BigDecimal.fromString("2"));

        swap.save();
    }

    //1、同步到OrderHistory
    let orderHistory = OrderHistory.load(swapID);
    if (SMART_ROUTE_ADDRESSES.indexOf(event.params.trader.toHexString()) == -1 &&orderHistory == null) {
        log.warning(`external swap from {},hash : {}`,[event.params.trader.toHexString(),event.transaction.hash.toHexString()]);
        orderHistory = new OrderHistory(swapID);
        orderHistory.source=SOURCE_POOL_SWAP;
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
        orderHistory.amountUSDC = swappedUSDC;
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.save();
    }

    // 更新交易人数
    updatePairTraderCount(event.transaction.from,event.params.receiver,pair as Pair);

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();

    //更新报表数据
    let pairDayData = updatePairDayData(event);
    pairDayData.untrackedBaseVolume = pairDayData.untrackedBaseVolume.plus(untrackedBaseVolume);
    pairDayData.untrackedQuoteVolume = pairDayData.untrackedBaseVolume.plus(untrackedQuoteVolume);

    let baseDayData=updateTokenDayData(baseToken, event);
    baseDayData.untrackedVolume = baseDayData.untrackedVolume.plus(untrackedBaseVolume);

    let quoteDayData=updateTokenDayData(quoteToken, event);
    quoteDayData.untrackedVolume = baseDayData.untrackedVolume.plus(untrackedQuoteVolume);

    pairDayData.save();
    baseDayData.save();
    quoteDayData.save();
}

export function handleBuyShares(event: BuyShares): void {
    let pair = Pair.load(event.address.toHexString());
    let toUser = createUser(event.params.to);
    let fromUser = createUser(event.transaction.from);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);
    let pmmState = getPMMState(event.address);

    let lpToken = createLpToken(event.address);

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
    }
    liquidityPosition.liquidityTokenBalance = balance;

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
    }

    liquidityPosition.save();
    liquidityHistory.save();

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
}

export function handleSellShares(event: SellShares): void {
    let pair = Pair.load(event.address.toHexString());
    let toUser = createUser(event.params.to);
    let fromUser = createUser(event.transaction.from);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let pmmState: DVM__getPMMStateResultStateStruct;
    pmmState = getPMMState(event.address);

    let lpToken = createLpToken(event.address);

    let dealedSharesAmount = convertTokenToDecimal(event.params.decreaseShares, lpToken.decimals);
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
    }
    liquidityPosition.liquidityTokenBalance = balance;

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
    }

    liquidityPosition.save();
    liquidityHistory.save();

    //更新基础信息
    if(pmmState !=null){
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
}

export function handleLpFeeRateChange(event: LpFeeRateChange): void{
    let pair = Pair.load(event.address.toHexString());

    if(pair.type == TYPE_DPP_POOL){
        let dpp =DPP.bind(event.address);
        pair.lpFeeRate = convertTokenToDecimal(dpp._LP_FEE_RATE_(),BigInt.fromI32(18));

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

export function handleTransfer(event: Transfer): void{
    let pair = Pair.load(event.address.toHexString());
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let lpToken = LpToken.load(event.address.toHexString());
    let dealedAmount = convertTokenToDecimal(event.params.amount,lpToken.decimals);

    if(event.params.to.toHexString() != ADDRESS_ZERO){
        let toUserLiquidityPostionID = toUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(toUserLiquidityPostionID);
        position.liquidityTokenBalance = position.liquidityTokenBalance.plus(dealedAmount);
        position.save();
    }

    if(event.params.from.toHexString() != ADDRESS_ZERO){
        let fromUserLiquidityPostionID = fromUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(fromUserLiquidityPostionID);
        position.liquidityTokenBalance = position.liquidityTokenBalance.minus(dealedAmount);
        position.save();
    }

}
