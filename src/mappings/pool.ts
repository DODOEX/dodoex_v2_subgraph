import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token, Pair, Swap, User, LiquidityPosition, LpToken, LiquidityHistory} from "../types/schema"
import {OrderHistory as OrderHistoryV1} from "../types/DODOV1Proxy01/DODOV1Proxy01"
import {
    createToken,
    createLpToken,
    createUser,
    ZERO_BI,
    ZERO_BD,
    ONE_BI,
    convertTokenToDecimal,
    getPMMState,
    TYPE_DPP_POOL,
    TYPE_DVM_POOL
} from "./helpers"
import {DODOSwap, BuyShares, SellShares} from "../types/templates/DVM/DVM"
import {updatePairDayData, updateTokenDayData} from "./dayUpdates"

export function handleDODOSwap(event: DODOSwap): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    let user = User.load(event.transaction.from.toHexString());
    let fromToken = Token.load(event.params.fromToken.toHexString());
    let toToken = Token.load(event.params.toToken.toHexString());
    let dealedFromAmount = convertTokenToDecimal(event.params.fromAmount, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.toAmount, toToken.decimals);
    let pmmState = getPMMState(event.address);

    let baseToken: Token, quoteToken: Token, baseVolume: BigDecimal, quoteVolume: BigDecimal;
    if (fromToken.id == pair.baseToken) {
        baseToken = fromToken as Token;
        quoteToken = toToken as Token;
        baseVolume = dealedFromAmount;
        quoteVolume = dealedToAmount;
    } else {
        baseToken = toToken as Token;
        quoteToken = fromToken as Token;
        baseVolume = dealedToAmount;
        quoteVolume = dealedFromAmount;
    }

    //todo usdc amount cacl
    let fromPrice = ZERO_BD;
    let toPrice = ZERO_BD;
    let swappedUSDC = dealedFromAmount.times(fromPrice).plus(dealedToAmount.times(toPrice));

    //1、更新pair
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseVolume);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(quoteVolume);
    pair.amountUSDC = pair.amountUSDC.plus(swappedUSDC);
    pair.save();

    //2、更新两个token的记录数据
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
    fromToken.tradeVolumeUSDC = fromToken.tradeVolumeUSDC.plus(swappedUSDC);
    fromToken.priceUSDC = fromPrice;
    fromToken.save();

    toToken.txCount = toToken.txCount.plus(ONE_BI);
    toToken.tradeVolume = toToken.tradeVolume.plus(dealedFromAmount);
    toToken.tradeVolumeUSDC = toToken.tradeVolumeUSDC.plus(swappedUSDC);
    toToken.priceUSDC = toPrice;
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
        swap.save();
    }

    //1、同步到OrderHistory
    let orderHistory = OrderHistory.load(swapID);
    if (orderHistory == null) {
        orderHistory = new OrderHistory(swapID);
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
        orderHistory.save();
    }

    updatePairDayData(event);
    updateTokenDayData(baseToken,event);
    updateTokenDayData(quoteToken,event);

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
}

export function handleSellShares(event: SellShares): void {
    let pair = Pair.load(event.address.toHexString());
    let toUser = createUser(event.params.to);
    let fromUser = createUser(event.transaction.from);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);
    let pmmState = getPMMState(event.address);

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

    lpToken.totalSupply = lpToken.totalSupply.minus(event.params.decreaseShares);

    pair.save();
    fromUser.save();
    toUser.save();
    baseToken.save();
    quoteToken.save();
    lpToken.save();
}
