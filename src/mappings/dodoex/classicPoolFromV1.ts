import {log, BigInt, BigDecimal, Address, ethereum, dataSource} from '@graphprotocol/graph-ts'
import {
    LiquidityHistory,
    LiquidityPosition,
    Pair,
    Token,
    Swap,
    OrderHistory,
    LpToken
} from '../../types/dodoex/schema'
import {DODO as DODOTemplate, DODOLpToken as DODOLpTokenTemplate} from '../../types/dodoex/templates'
import {
    ONE_BI,
    ZERO_BD,
    ZERO_BI,
    convertTokenToDecimal,
    createToken,
    createUser,
    createLpToken,
    getDODOZoo,
    getPMMState,
    BI_18,
    updatePairTraderCount,
    fetchTokenBalance,
    updateStatistics,
    createTokenByCall
} from './helpers'
import {DODOBirth, AddDODOCall} from '../../types/dodoex/DODOZoo/DODOZoo'
import {
    Deposit, Withdraw, DODO, BuyBaseToken, SellBaseToken, UpdateLiquidityProviderFeeRate,
    DisableBaseDepositCall,
    EnableBaseDepositCall,
    DisableQuoteDepositCall,
    EnableQuoteDepositCall,
    DisableTradingCall,
    EnableTradingCall,
    ClaimAssets
} from '../../types/dodoex/templates/DODO/DODO';

import {
    SMART_ROUTE_ADDRESSES,
    ADDRESS_ZERO,
    DODOZooID,
    TYPE_CLASSICAL_POOL,
    SOURCE_POOL_SWAP,
    TRANSACTION_TYPE_SWAP,
    TRANSACTION_TYPE_CP,
    TRANSACTION_TYPE_LP
} from "../constant"

import {
    updatePrice,
    calculateUsdVolume
} from "./pricing"

import {addTransaction} from "./transaction"

const POOLS_ADDRESS: string[] = [
    "0x75c23271661d9d143dcb617222bc4bec783eff34",//WETH-USDC
    "0x562c0b218cc9ba06d9eb42f3aef54c54cc5a4650",//LINK-USDC
    "0x9d9793e1e18cdee6cf63818315d55244f73ec006",//FIN-USDT
    "0xca7b0632bd0e646b0f823927d3d2e61b00fe4d80",//SNX-USDC
    "0x0d04146b2fe5d267629a7eb341fb4388dcdbd22f",//COMP-USDC
    "0x2109f78b46a789125598f5ad2b7f243751c2934d",//WBTC-USDC
    "0x1b7902a66f133d899130bf44d7d879da89913b2e",//YFI-USDC
    "0x1a7fe5d6f0bb2d071e16bdd52c863233bbfd38e9",//WETH-USDT
    "0x8876819535b48b551c9e97ebc07332c7482b4b2d",//DODO-USDT
    "0xc9f93163c99695c6526b799ebca2207fdf7d61ad",//USDT-USDC
    "0x94512fd4fb4feb63a6c0f4bedecc4a00ee260528",//AAVE-USDC
    "0x85f9569b69083c3e6aeffd301bb2c65606b5d575",//wCRES-USDT
]

const BASE_TOKENS: string[] = [
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",//WETH
    "0x514910771af9ca656af840dff83e8264ecf986ca",//LINK
    "0x054f76beed60ab6dbeb23502178c52d6c5debe40",//FIN
    "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",//SNX
    "0xc00e94cb662c3520282e6f5717214004a7f26888",//COMP
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",//WBTC
    "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",//YFI
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",//WETH
    "0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd",//DODO
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//USDT
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",//AAVE
    "0xa0afaa285ce85974c3c881256cb7f225e3a1178a",//wCRES
]

const QUOTE_TOKENS: string[] = [
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//USDT
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//USDT
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//USDT
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//USDT
]

const BASE_LP_TOKENS: string[] = [
    "0xc11eccdee225d644f873776a68a02ecd8c015697",//WETH
    "0xf03f3d2fbee37f92ec91ae927a8019cacef4b738",//LINK
    "0x7c4a6813b6af50a2aa2720d861c796a990245383",//FIN
    "0x5bd1b7d3930d7a5e8fd5aeec6b931c822c8be14e",//SNX
    "0x53cf4694b427fcef9bb1f4438b68df51a10228d0",//COMP
    "0x2ec2a42901c761b295a9e6b95200cd0bdaa474eb",//WBTC
    "0xe2852c572fc42c9e2ec03197defa42c647e89291",//YFI
    "0x1270be1bf727447270f237115f0943011e35ee3e",//WETH
    "0x3befc1f0f6cfe0ea852ae61709de370599c88bde ",//DODO
    "0x50b11247bf14ee5116c855cde9963fa376fcec86",//USDT
    "0x30ad5b6d4e531591591113b49eae2fafbc2236d5",//AAVE
    "0xcfba2e0f1bbf6ad96960d8866316b02e36ed1761",//wCRES
]

const QUOTE_LP_TOKENS: string[] = [
    "0x6a5eb3555cbbd29016ba6f6ffbccee28d57b2932",
    "0x0f769bc3ecbda8e0d78280c88e31609e899a1f78",
    "0xa62bf27fd1d64d488b609a09705a28a9b5240b9c",
    "0x1b06a22b20362b4115388ab8ca3ed0972230d78a",
    "0x51baf2656778ad6d67b19a419f91d38c3d0b87b6",
    "0x0cdb21e20597d753c90458f5ef2083f6695eb794",
    "0xd9d0bd18ddfa753d0c88a060ffb60657bb0d7a07",
    "0x3dc2eb2f59ddca985174bb20ae9141ba66cfd2d3",
    "0x1e5bfc8c1225a6ce59504988f823c44e08414a49",
    "0x05a54b466f01510e92c02d3a180bae83a64baab8",
    "0x5840a9e733960f591856a5d13f6366658535bbe5",
    "0xe236b57de7f3e9c3921391c4cb9a42d9632c0022"
]

const OWNER: string[] = [
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x6dae6ae227438378c117821c51fd61661faa8893",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0 ",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x6dae6ae227438378c117821c51fd61661faa8893",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x95c4f5b83aa70810d4f142d58e5f7242bd891cb0",
    "0x9c59990ec0177d87ed7d60a56f584e6b06c639a2",
]

const createTime: i32[] = [
    1596787200,
    1598180006,
    1602236520,
    1598613764,
    1598702967,
    1599011490,
    1599011463,
    1599011490,
    1601348330,
    1603302872,
    1604862756,
    1606415616
]

export function insertAllPairs4V1Mainnet(event: ethereum.Event): void {

    if (DODOZooID != "dodoex-v2") {
        return;
    }

    let dodoZoo = getDODOZoo();

    for (let i = 0; i < POOLS_ADDRESS.length; i++) {

        if (Pair.load(POOLS_ADDRESS[i].toString()) == null) {
            //tokens
            let baseToken = createToken(Address.fromString(BASE_TOKENS[i]), event);
            let quoteToken = createToken(Address.fromString(QUOTE_TOKENS[i]), event);

            let pair = new Pair(POOLS_ADDRESS[i].toString()) as Pair

            pair.baseToken = baseToken.id;
            pair.quoteToken = quoteToken.id;
            pair.type = TYPE_CLASSICAL_POOL;

            pair.creator = Address.fromString(OWNER[i]);
            pair.createdAtTimestamp = BigInt.fromI32(createTime[i]);
            pair.createdAtBlockNumber = event.block.number;

            let baseLpToken = createLpToken(Address.fromString(BASE_LP_TOKENS[i]), pair);
            let quoteLpToken = createLpToken(Address.fromString(QUOTE_LP_TOKENS[i]), pair);

            pair.lastTradePrice = ZERO_BD;
            pair.baseLpToken = baseLpToken.id;
            pair.quoteLpToken = quoteLpToken.id;
            pair.txCount = ZERO_BI;
            pair.volumeBaseToken = ZERO_BD;
            pair.volumeQuoteToken = ZERO_BD;
            pair.liquidityProviderCount = ZERO_BI;
            pair.untrackedBaseVolume = ZERO_BD;
            pair.untrackedQuoteVolume = ZERO_BD;
            pair.feeBase = ZERO_BD;
            pair.feeQuote = ZERO_BD;
            pair.traderCount = ZERO_BI;
            pair.isTradeAllowed = true;
            pair.isDepositBaseAllowed = false;
            pair.isDepositQuoteAllowed = false;
            pair.volumeUSD = ZERO_BD;

            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;

            pair.lpFeeRate = BigDecimal.fromString("0.003");

            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);

            baseToken.save();
            quoteToken.save();
            baseLpToken.save();
            quoteLpToken.save();
            pair.save();

            dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
            DODOTemplate.create(Address.fromString(POOLS_ADDRESS[i]));

            DODOLpTokenTemplate.create(Address.fromString(BASE_LP_TOKENS[i]));
            DODOLpTokenTemplate.create(Address.fromString(QUOTE_LP_TOKENS[i]));
        }

    }

    dodoZoo.save();

}

export function handleDODOBirth(event: DODOBirth): void {
    insertAllPairs4V1Mainnet(event);

    if (dataSource.address().toHexString() != "0x3a97247df274a17c59a3bd12735ea3fcdfb49950") {
        let dodoZoo = getDODOZoo();

        let pair = Pair.load(event.params.newBorn.toHexString());
        if (pair == null) {
            //tokens
            let dodo = DODO.bind(event.params.newBorn);
            let pair = new Pair(event.params.newBorn.toHexString()) as Pair;

            let baseToken = createToken(event.params.baseToken, event);
            let quoteToken = createToken(event.params.quoteToken, event);
            let baseLpToken = createLpToken(dodo._BASE_CAPITAL_TOKEN_(), pair);
            let quoteLpToken = createLpToken(dodo._QUOTE_CAPITAL_TOKEN_(), pair);

            pair.baseLpToken = baseLpToken.id;
            pair.quoteLpToken = quoteLpToken.id;
            pair.baseToken = baseToken.id;
            pair.quoteToken = quoteToken.id;
            pair.type = TYPE_CLASSICAL_POOL;

            pair.creator = Address.fromString(ADDRESS_ZERO);
            pair.createdAtTimestamp = event.block.timestamp;
            pair.createdAtBlockNumber = event.block.number;
            pair.lastTradePrice = ZERO_BD;
            pair.txCount = ZERO_BI;
            pair.volumeBaseToken = ZERO_BD;
            pair.volumeQuoteToken = ZERO_BD;
            pair.liquidityProviderCount = ZERO_BI;
            pair.untrackedBaseVolume = ZERO_BD;
            pair.untrackedQuoteVolume = ZERO_BD;
            pair.feeBase = ZERO_BD;
            pair.feeQuote = ZERO_BD;
            pair.traderCount = ZERO_BI;
            pair.isTradeAllowed = true;
            pair.isDepositBaseAllowed = true;
            pair.isDepositQuoteAllowed = true;
            pair.volumeUSD = ZERO_BD;

            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;

            pair.lpFeeRate = convertTokenToDecimal(dodo._LP_FEE_RATE_(), BI_18);

            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);

            baseToken.save();
            quoteToken.save();
            baseLpToken.save();
            quoteLpToken.save();
            pair.save();

            dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
            DODOTemplate.create(event.params.newBorn);

            DODOLpTokenTemplate.create(Address.fromString(baseLpToken.id));
            DODOLpTokenTemplate.create(Address.fromString(quoteLpToken.id));

            dodoZoo.save();
        }
    }

}

export function handleDeposit(event: Deposit): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let toUser = createUser(event.params.receiver, event);
    let fromUser = createUser(event.transaction.from, event);
    let baseToken = createToken(Address.fromString(pair.baseToken), event);
    let quoteToken = createToken(Address.fromString(pair.quoteToken), event);

    let baseLpToken = createLpToken(Address.fromString(pair.baseLpToken), pair as Pair);
    let quoteLpToken = createLpToken(Address.fromString(pair.quoteLpToken), pair as Pair);

    let amount = convertTokenToDecimal(event.params.amount, event.params.isBaseToken ? baseToken.decimals : quoteToken.decimals);
    let baseAmountChange = ZERO_BD;
    let quoteAmountChange = ZERO_BD;
    let dealedSharesAmount: BigDecimal;

    //更新用户LP token信息
    let liquidityPositionID: string, lpToken: LpToken;
    if (event.params.isBaseToken) {
        liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(pair.baseLpToken);
        lpToken = LpToken.load(pair.baseLpToken) as LpToken;
        dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, baseLpToken.decimals);
        baseAmountChange = amount;
    } else {
        liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(pair.quoteLpToken);
        lpToken = LpToken.load(pair.quoteLpToken) as LpToken;
        dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, quoteLpToken.decimals);
        quoteAmountChange = amount;
    }

    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.params.receiver.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    }
    liquidityPosition.lastTxTime = event.block.timestamp;
    liquidityPosition.liquidityTokenBalance = liquidityPosition.liquidityTokenBalance.plus(dealedSharesAmount);

    pair.baseReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(baseToken.id), event.address), baseToken.decimals);
    pair.quoteReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(quoteToken.id), event.address), quoteToken.decimals);

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    lpToken.totalSupply = lpToken.totalSupply.plus(event.params.lpTokenAmount);

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
        liquidityHistory.balance = liquidityPosition.liquidityTokenBalance;
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

    addTransaction(event,event.params.payer.toHexString(),)
}

export function handleWithdraw(event: Withdraw): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let toUser = createUser(event.params.receiver, event);
    let fromUser = createUser(event.transaction.from, event);
    let baseToken = createToken(Address.fromString(pair.baseToken), event);
    let quoteToken = createToken(Address.fromString(pair.quoteToken), event);
    let baseLpToken = createLpToken(Address.fromString(pair.baseLpToken), pair as Pair);
    let quoteLpToken = createLpToken(Address.fromString(pair.quoteLpToken), pair as Pair);

    let amount = convertTokenToDecimal(event.params.amount, event.params.isBaseToken ? baseToken.decimals : quoteToken.decimals);
    let baseAmountChange = ZERO_BD;
    let quoteAmountChange = ZERO_BD;
    let dealedSharesAmount: BigDecimal;
    //更新用户LP token信息
    let liquidityPositionID: string, lpToken: LpToken;
    if (event.params.isBaseToken) {
        liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(pair.baseLpToken);
        lpToken = LpToken.load(pair.baseLpToken) as LpToken;
        dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, baseLpToken.decimals);
        baseAmountChange = amount;
    } else {
        liquidityPositionID = event.params.receiver.toHexString().concat("-").concat(pair.quoteLpToken);
        lpToken = LpToken.load(pair.quoteLpToken) as LpToken;
        dealedSharesAmount = convertTokenToDecimal(event.params.lpTokenAmount, quoteLpToken.decimals);
        quoteAmountChange = amount;
    }
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = event.address.toHexString();
        liquidityPosition.user = event.params.receiver.toHexString();
        liquidityPosition.liquidityTokenBalance = convertTokenToDecimal(fetchTokenBalance(Address.fromString(lpToken.id), event.params.receiver), lpToken.decimals);
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.lastTxTime = ZERO_BI;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    } else {
        liquidityPosition.liquidityTokenBalance = liquidityPosition.liquidityTokenBalance.minus(dealedSharesAmount);
    }

    //更新基础信息
    pair.baseReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(baseToken.id), event.address), baseToken.decimals);
    pair.quoteReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(quoteToken.id), event.address), quoteToken.decimals);

    fromUser.txCount = fromUser.txCount.plus(ONE_BI);
    toUser.txCount = toUser.txCount.plus(ONE_BI);

    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    lpToken.totalSupply = lpToken.totalSupply.minus(event.params.lpTokenAmount);

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
        liquidityHistory.lpToken = lpToken.id;
        liquidityHistory.balance = liquidityPosition.liquidityTokenBalance;
        liquidityHistory.type = "WITHDRAW";
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
}

export function handleSellBaseToken(event: SellBaseToken): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let user = createUser(event.transaction.from, event);
    let fromToken = createToken(Address.fromString(pair.baseToken), event);
    let toToken = createToken(Address.fromString(pair.quoteToken), event);
    let dealedFromAmount = convertTokenToDecimal(event.params.payBase, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.receiveQuote, toToken.decimals);
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

    //1、更新pair
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseVolume);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(quoteVolume);
    pair.feeBase = pair.feeBase.plus(baseLpFee);
    pair.feeQuote = pair.feeQuote.plus(quoteLpFee);
    pair.baseReserve = pair.baseReserve.plus(baseVolume);
    pair.quoteReserve = pair.quoteReserve.minus(quoteVolume);
    if (baseVolume.gt(ZERO_BD)) {
        pair.lastTradePrice = quoteVolume.div(baseVolume);
    }
    updatePrice(pair as Pair,event.block.timestamp);
    let volumeUSD = calculateUsdVolume(baseToken as Token, quoteToken as Token, baseVolume, quoteVolume);
    pair.volumeUSD = volumeUSD;
    if (volumeUSD.equals(ZERO_BD)) {
        pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(baseVolume);
        pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(quoteVolume);
        untrackedBaseVolume = baseVolume;
        untrackedQuoteVolume = quoteVolume;
    }
    pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(untrackedBaseVolume);
    pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(untrackedQuoteVolume);
    pair.save();

    //2、更新两个token的记录数据
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
    fromToken.save();

    toToken.txCount = toToken.txCount.plus(ONE_BI);
    toToken.tradeVolume = toToken.tradeVolume.plus(dealedFromAmount);

    toToken.save();

    //3、更新用户信息
    user.txCount = user.txCount.plus(ONE_BI);
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

    //1、同步到OrderHistory
    let orderHistory = OrderHistory.load(swapID);
    if (SMART_ROUTE_ADDRESSES.indexOf(event.params.seller.toHexString()) == -1 && orderHistory == null) {
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
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.volumeUSD = volumeUSD;
        orderHistory.save();
    }

    // 更新交易人数
    updatePairTraderCount(event.transaction.from, event.params.seller, pair as Pair, event);

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();

    //更新日报表数据
    updateStatistics(event, pair as Pair, baseVolume, quoteVolume, baseLpFee, quoteLpFee, untrackedBaseVolume, untrackedQuoteVolume, baseToken, quoteToken, event.params.seller, volumeUSD);
}

export function handleBuyBaseToken(event: BuyBaseToken): void {
    //base data
    let swapID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    let user = createUser(event.transaction.from, event);
    let fromToken = createToken(Address.fromString(pair.quoteToken), event);
    let toToken = createToken(Address.fromString(pair.baseToken), event);
    let dealedFromAmount = convertTokenToDecimal(event.params.payQuote, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.receiveBase, toToken.decimals);
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

    //1、更新pair
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseVolume);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(quoteVolume);
    pair.feeBase = pair.feeBase.plus(baseLpFee);
    pair.feeQuote = pair.feeQuote.plus(quoteLpFee);
    pair.baseReserve = pair.baseReserve.minus(baseVolume);
    pair.quoteReserve = pair.quoteReserve.plus(quoteVolume);
    if (baseVolume.gt(ZERO_BD)) {
        pair.lastTradePrice = quoteVolume.div(baseVolume);
    }
    updatePrice(pair as Pair,event.block.timestamp);
    let volumeUSD = calculateUsdVolume(baseToken as Token, quoteToken as Token, baseVolume, quoteVolume);
    pair.volumeUSD = volumeUSD;
    if (volumeUSD.equals(ZERO_BD)) {
        pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(baseVolume);
        pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(quoteVolume);
        untrackedBaseVolume = baseVolume;
        untrackedQuoteVolume = quoteVolume;
    }
    pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(untrackedBaseVolume);
    pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(untrackedQuoteVolume);
    pair.save();

    //2、更新两个token的记录数据
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);

    fromToken.save();

    toToken.txCount = toToken.txCount.plus(ONE_BI);
    toToken.tradeVolume = toToken.tradeVolume.plus(dealedFromAmount);

    toToken.save();

    //3、更新用户信息
    user.txCount = user.txCount.plus(ONE_BI);
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

    //1、同步到OrderHistory
    let orderHistory = OrderHistory.load(swapID);
    if (SMART_ROUTE_ADDRESSES.indexOf(event.params.buyer.toHexString()) == -1 && orderHistory == null) {
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
        orderHistory.tradingReward = ZERO_BD;
        orderHistory.volumeUSD = volumeUSD;
        orderHistory.save();
    }

    // 更新交易人数
    updatePairTraderCount(event.transaction.from, event.params.buyer, pair as Pair, event);

    //更新DODOZoo
    let dodoZoo = getDODOZoo();
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
    dodoZoo.save();

    //更新报表数据
    updateStatistics(event, pair as Pair, baseVolume, quoteVolume, baseLpFee, quoteLpFee, untrackedBaseVolume, untrackedQuoteVolume, baseToken, quoteToken, event.params.buyer, volumeUSD);
}

export function handleUpdateLiquidityProviderFeeRate(event: UpdateLiquidityProviderFeeRate): void {
    let pair = Pair.load(event.address.toHexString());
    if (pair === null) {
        return;
    }
    pair.lpFeeRate = convertTokenToDecimal(event.params.newLiquidityProviderFeeRate, BI_18);
    pair.save();
}

export function handleDisableTrading(call: DisableTradingCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isTradeAllowed = false;
    }
    pair.save();
}

export function handleEnableTrading(call: EnableTradingCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isTradeAllowed = true;
    }
    pair.save();
}

export function handleDisableQuoteDeposit(call: DisableQuoteDepositCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isDepositQuoteAllowed = false;
    }
    pair.save();
}

export function handleEnableQuoteDeposit(call: EnableQuoteDepositCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isDepositQuoteAllowed = true;
    }
    pair.save();
}

export function handleDisableBaseDeposit(call: DisableBaseDepositCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isDepositBaseAllowed = false;
    }
    pair.save();
}

export function handleEnableBaseDeposit(call: EnableBaseDepositCall): void {
    let pairAddress = dataSource.address().toHexString();
    let pair = Pair.load(pairAddress);
    if (pair === null) {
        return;
    }
    if (pair != null) {
        pair.isDepositBaseAllowed = true;
    }
    pair.save();
}

export function handleClaimAssets(event: ClaimAssets): void {
    let pair = Pair.load(dataSource.address().toHexString());
    if (pair != null) {
        let baseToken = Token.load(pair.baseToken);
        let quoteToken = Token.load(pair.quoteToken);
        pair.baseReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(pair.baseToken), dataSource.address()), baseToken.decimals);
        pair.quoteReserve = convertTokenToDecimal(fetchTokenBalance(Address.fromString(pair.quoteToken), dataSource.address()), quoteToken.decimals);
        pair.save();
    }
}