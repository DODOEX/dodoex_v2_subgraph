import {log, BigInt, BigDecimal, Address, ethereum} from '@graphprotocol/graph-ts'
import {LiquidityHistory, LiquidityPosition, Pair, Token, Swap, OrderHistory} from '../types/schema'
import {DODO as DODOTemplate} from '../types/templates'
import {
    ONE_BI,
    ZERO_BD,
    ZERO_BI,
    convertTokenToDecimal,
    TYPE_CLASSICAL_POOL,
    createToken,
    createUser,
    createLpToken,
    getDODOZoo,
    getPMMState,
    BI_18,
    SOURCE_POOL_SWAP,
    updatePairTraderCount
} from './helpers'
import {DODOBirth} from '../types/DodoZoo/DodoZoo'
import {Deposit, Withdraw, DODO, BuyBaseToken, SellBaseToken} from '../types/templates/DODO/DODO';
import {updatePairDayData, updateTokenDayData} from "./dayUpdates"
import {getUSDCPrice} from "./pricing"

import {
    SMART_ROUTE_ADDRESS,
    ADDRESS_ZERO,
} from "./constant"

const POOLS_ADDRESS: String[] = [
    "0x75c23271661d9d143DCb617222BC4BEc783eff34",//WETH-USDC
    "0x562c0b218cc9ba06D9EB42F3aEf54C54cC5a4650",//LINK-USDC
    "0x9D9793e1E18CDEe6cf63818315D55244f73EC006",//FIN-USDT
    "0xCa7b0632bd0E646B0f823927D3D2e61B00fE4D80",//SNX-USDC
    "0x0D04146B2Fe5d267629a7eb341Fb4388DcdBD22f",//COMP-USDC
    "0x2109F78b46a789125598f5ad2b7f243751c2934d",//WBTC-USDC
    "0x1B7902a66f133d899130bF44d7D879dA89913b2e",//YFI-USDC
    "0x1A7fE5D6f0BB2D071E16BDD52C863233BBFd38e9",//WETH-USDT
    "0x8876819535b48b551C9e97EBc07332C7482b4b2d",//DODO-USDT
    "0xC9f93163c99695c6526b799EbcA2207Fdf7D61aD",//USDT-USDC
    "0x94512fd4Fb4FEb63a6C0F4bEDEcC4A00eE260528",//AAVE-USDC
    "0x85F9569B69083C3e6aefFd301BB2c65606b5D575",//wCRES-USDT
]

const BASE_TOKENS: String[] = [
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",//LINK
    "0x054f76beED60AB6dBEb23502178C52d6C5dEbE40",//FIN
    "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",//SNX
    "0xc00e94Cb662C3520282E6f5717214004A7f26888",//COMP
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",//WBTC
    "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",//YFI
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH
    "0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd",//DODO
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDT
    "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",//AAVE
    "0xa0afAA285Ce85974c3C881256cB7F225e3A1178a",//wCRES
]

const QUOTE_TOKENS: String[] = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDT
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDT
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDT
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDT
]

const BASE_LP_TOKENS: String[] = [
    "0xc11eccdee225d644f873776a68a02ecd8c015697",//WETH
    "0xf03f3d2fbee37f92ec91ae927a8019cacef4b738",//LINK
    "0x7c4a6813b6af50a2aa2720d861c796a990245383",//FIN
    "0x5bd1b7d3930d7a5e8fd5aeec6b931c822c8be14e",//SNX
    "0x53cf4694b427fcef9bb1f4438b68df51a10228d0",//COMP
    "0x2ec2a42901c761b295a9e6b95200cd0bdaa474eb",//WBTC
    "0xe2852c572fc42c9e2ec03197defa42c647e89291",//YFI
    ADDRESS_ZERO,//WETH
    ADDRESS_ZERO,//DODO
    "0x50b11247bf14ee5116c855cde9963fa376fcec86",//USDT
    "0x30ad5b6d4e531591591113b49eae2fafbc2236d5",//AAVE
    "0xcfba2e0f1bbf6ad96960d8866316b02e36ed1761",//wCRES
]

const QUOTE_LP_TOKENS: String[] = [
    "0x6a5eb3555cbbd29016ba6f6ffbccee28d57b2932",
    "0x0f769bc3ecbda8e0d78280c88e31609e899a1f78",
    "0xa62bf27fd1d64d488b609a09705a28a9b5240b9c",
    "0x1b06a22b20362b4115388ab8ca3ed0972230d78a",
    "0x51baf2656778ad6d67b19a419f91d38c3d0b87b6",
    "0x0cdb21e20597d753c90458f5ef2083f6695eb794",
    "0xd9d0bd18ddfa753d0c88a060ffb60657bb0d7a07",
    ADDRESS_ZERO,
    ADDRESS_ZERO,
    "0x05a54b466f01510e92c02d3a180bae83a64baab8",
    "0x5840a9e733960f591856a5d13f6366658535bbe5",
    "0xe236b57de7f3e9c3921391c4cb9a42d9632c0022"
]

function insertAllPairs4V1(event: ethereum.Event): void {

    let dodoZoo = getDODOZoo();

    for (let i = 0; i < POOLS_ADDRESS.length; i++) {

        if (Pair.load(POOLS_ADDRESS[i].toString()) == null) {
            //tokens
            let baseToken = createToken(Address.fromString(BASE_TOKENS[i].toString()), event);
            let quoteToken = createToken(Address.fromString(QUOTE_TOKENS[i].toString()), event);

            let pair = new Pair(POOLS_ADDRESS[i].toString()) as Pair

            pair.baseToken = baseToken.id;
            pair.quoteToken = quoteToken.id;
            pair.type = TYPE_CLASSICAL_POOL;

            pair.creator = Address.fromString(ADDRESS_ZERO);
            pair.createdAtTimestamp = event.block.timestamp;
            pair.createdAtBlockNumber = event.block.number;

            let baseLpToken = createLpToken(Address.fromString(BASE_LP_TOKENS[i].toString()));
            let quoteLpToken = createLpToken(Address.fromString(QUOTE_LP_TOKENS[i].toString()));

            pair.baseLpToken = baseLpToken.id;
            pair.quoteLpToken = quoteLpToken.id;
            pair.txCount = ZERO_BI;
            pair.volumeBaseToken = ZERO_BD;
            pair.volumeQuoteToken = ZERO_BD;
            pair.tradeVolumeUSDC = ZERO_BD;
            pair.reserveUSDC = ZERO_BD;
            pair.liquidityProviderCount = ZERO_BI;
            pair.untrackedBaseVolume = ZERO_BD;
            pair.untrackedQuoteVolume = ZERO_BD;
            pair.baseLpFee = ZERO_BD;
            pair.quoteLpFee = ZERO_BD;
            pair.lpFeeUSDC = ZERO_BD;
            pair.traderCount = ZERO_BI;

            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;

            pair.lpFeeRate = ZERO_BD;

            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);

            pair.save();

            dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
            DODOTemplate.create(Address.fromString(POOLS_ADDRESS[i].toString()));
        }

    }

    dodoZoo.save();

}

export function handleDODOBirth(event: DODOBirth): void {
    insertAllPairs4V1(event);

    let dodoZoo = getDODOZoo();

    if (Pair.load(event.params.newBorn.toHexString()) == null) {
        //tokens
        let dodo = DODO.bind(event.params.newBorn);

        let baseToken = createToken(event.params.baseToken, event);
        let quoteToken = createToken(event.params.quoteToken, event);
        let baseLpToken = createLpToken(dodo._BASE_CAPITAL_TOKEN_());
        let quoteLpToken = createLpToken(dodo._QUOTE_CAPITAL_TOKEN_());

        let pair = new Pair(event.params.newBorn.toHexString()) as Pair;

        pair.baseLpToken = baseLpToken.id;
        pair.quoteToken = quoteLpToken.id;
        pair.baseToken = baseToken.id;
        pair.quoteToken = quoteToken.id;
        pair.type = TYPE_CLASSICAL_POOL;

        pair.creator = Address.fromString(ADDRESS_ZERO);
        pair.createdAtTimestamp = event.block.timestamp;
        pair.createdAtBlockNumber = event.block.number;

        pair.txCount = ZERO_BI;
        pair.volumeBaseToken = ZERO_BD;
        pair.volumeQuoteToken = ZERO_BD;
        pair.tradeVolumeUSDC = ZERO_BD;
        pair.reserveUSDC = ZERO_BD;
        pair.liquidityProviderCount = ZERO_BI;
        pair.untrackedBaseVolume = ZERO_BD;
        pair.untrackedQuoteVolume = ZERO_BD;
        pair.baseLpFee = ZERO_BD;
        pair.quoteLpFee = ZERO_BD;
        pair.lpFeeUSDC = ZERO_BD;
        pair.traderCount = ZERO_BI;

        pair.i = ZERO_BI;
        pair.k = ZERO_BI;
        pair.baseReserve = ZERO_BD;
        pair.quoteReserve = ZERO_BD;

        pair.lpFeeRate = ZERO_BD;

        pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
        pair.maintainer = Address.fromString(ADDRESS_ZERO);

        pair.save();

        dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
        DODOTemplate.create(event.params.newBorn);
    }

    dodoZoo.save();

}

export function handleDeposit(event: Deposit): void {
    let pair = Pair.load(event.address.toHexString());
    let toUser = createUser(event.params.receiver);
    let fromUser = createUser(event.transaction.from);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let lpToken = createLpToken(event.address);

    let amount = convertTokenToDecimal(event.params.amount,event.params.isBaseToken?baseToken.decimals:quoteToken.decimals);
    let dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, lpToken.decimals);
    //更新用户LP token信息
    let liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(event.address.toHexString());
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.params.receiver.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
    }
    liquidityPosition.liquidityTokenBalance = liquidityPosition.liquidityTokenBalance.plus(dealedSharesAmount);

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
        liquidityHistory.user = event.params.receiver.toHexString();
        liquidityHistory.amount = amount;
        liquidityHistory.balance = ZERO_BD;
    }

    liquidityPosition.save();
    liquidityHistory.save();

    //不更新pair基础信息（i，k，B0，Q0，B，Q）
    if(event.params.isBaseToken){
        pair.baseReserve = pair.baseReserve.plus(amount);
    }else{
        pair.quoteReserve = pair.quoteReserve.plus(amount);
    }

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    lpToken.totalSupply = lpToken.totalSupply.plus(event.params.lpTokenAmount);

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

export function handleWithdraw(event: Withdraw): void {
    let pair = Pair.load(event.address.toHexString());
    let toUser = createUser(event.params.receiver);
    let fromUser = createUser(event.transaction.from);
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let lpToken = createLpToken(event.address);

    let amount = convertTokenToDecimal(event.params.amount,event.params.isBaseToken?baseToken.decimals:quoteToken.decimals);
    let dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, lpToken.decimals);

    //更新用户LP token信息
    let liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(event.address.toHexString());
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.params.receiver.toHexString();
        liquidityPosition.liquidityTokenBalance = dealedSharesAmount;
    }

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
        liquidityHistory.user = event.params.receiver.toHexString();
        liquidityHistory.amount = dealedSharesAmount;

        liquidityHistory.balance = amount;
    }

    liquidityPosition.save();
    liquidityHistory.save();

    //更新基础信息
    if(event.params.isBaseToken){
        pair.baseReserve = pair.baseReserve.minus(amount);
    }else{
        pair.quoteReserve = pair.quoteReserve.minus(amount);
    }

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    lpToken.totalSupply = lpToken.totalSupply.minus(event.params.lpTokenAmount);

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

export function handleSellBaseToken(event: SellBaseToken): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    let user = createUser(event.transaction.from);
    let fromToken = createToken(Address.fromString(pair.baseToken), event);
    let toToken = createToken(Address.fromString(pair.quoteToken), event);
    let dealedFromAmount = convertTokenToDecimal(event.params.payBase, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.receiveQuote, toToken.decimals);
    let fromPrice = getUSDCPrice(pair as Pair, true,event.block.number);
    let toPrice = getUSDCPrice(pair as Pair, false,event.block.number);
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
            untrackedQuoteVolume = dealedFromAmount;
        }
    }

    let swappedUSDC = dealedFromAmount.times(fromPrice).plus(dealedToAmount.times(toPrice));
    lpFeeUsdc = swappedUSDC.times(pair.lpFeeRate).div(BI_18.toBigDecimal());

    //1、更新pair
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
    if(fromPrice.equals(ZERO_BD)){
        fromToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedFromAmount);
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
        swap.to = event.params.seller;//to address
        swap.logIndex = event.logIndex;
        swap.sender = event.params.seller;
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
    if (event.params.seller.notEqual(Address.fromString(SMART_ROUTE_ADDRESS)) && orderHistory == null) {
        orderHistory = new OrderHistory(swapID);
        orderHistory.source = SOURCE_POOL_SWAP;
        orderHistory.hash = event.transaction.hash.toHexString();
        orderHistory.timestamp = event.block.timestamp;
        orderHistory.block = event.block.number;
        orderHistory.fromToken = fromToken.id;
        orderHistory.toToken = toToken.id;
        orderHistory.from = event.transaction.from;
        orderHistory.to = event.params.seller;
        orderHistory.sender = event.params.seller;
        orderHistory.amountIn = dealedFromAmount;
        orderHistory.amountOut = dealedToAmount;
        orderHistory.logIndex = event.logIndex;
        orderHistory.amountUSDC = swappedUSDC;
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.save();
    }

    // 更新交易人数
    updatePairTraderCount(event.transaction.from, event.params.seller, pair as Pair);

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

export function handleBuyBaseToken(event: BuyBaseToken): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    let user = createUser(event.transaction.from);
    let fromToken = createToken(Address.fromString(pair.quoteToken), event);
    let toToken = createToken(Address.fromString(pair.baseToken), event);
    let dealedFromAmount = convertTokenToDecimal(event.params.payQuote, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.receiveBase, toToken.decimals);
    let fromPrice = getUSDCPrice(pair as Pair, true,event.block.number);
    let toPrice = getUSDCPrice(pair as Pair, false,event.block.number);
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
            untrackedQuoteVolume = dealedFromAmount;
        }
    }


    let swappedUSDC = dealedFromAmount.times(fromPrice).plus(dealedToAmount.times(toPrice));
    lpFeeUsdc = swappedUSDC.times(pair.lpFeeRate).div(BI_18.toBigDecimal());

    //1、更新pair
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
        swap.to = event.params.buyer;//to address
        swap.logIndex = event.logIndex;
        swap.sender = event.params.buyer;
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
    if (event.params.buyer.notEqual(Address.fromString(SMART_ROUTE_ADDRESS)) && orderHistory == null) {
        orderHistory = new OrderHistory(swapID);
        orderHistory.source = SOURCE_POOL_SWAP;
        orderHistory.hash = event.transaction.hash.toHexString();
        orderHistory.timestamp = event.block.timestamp;
        orderHistory.block = event.block.number;
        orderHistory.fromToken = fromToken.id;
        orderHistory.toToken = toToken.id;
        orderHistory.from = event.transaction.from;
        orderHistory.to = event.params.buyer;
        orderHistory.sender = event.params.buyer;
        orderHistory.amountIn = dealedFromAmount;
        orderHistory.amountOut = dealedToAmount;
        orderHistory.logIndex = event.logIndex;
        orderHistory.amountUSDC = swappedUSDC;
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.save();
    }

    // 更新交易人数
    updatePairTraderCount(event.transaction.from, event.params.buyer, pair as Pair);

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
