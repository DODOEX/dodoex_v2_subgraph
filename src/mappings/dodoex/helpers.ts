/* eslint-disable prefer-const */
import {log, BigInt, BigDecimal, Address, ethereum, dataSource} from '@graphprotocol/graph-ts'
import {ERC20} from "../../types/dodoex/DODOV2Proxy02/ERC20"
import {ERC20NameBytes} from "../../types/dodoex/DODOV2Proxy02/ERC20NameBytes"
import {ERC20SymbolBytes} from "../../types/dodoex/DODOV2Proxy02/ERC20SymbolBytes"
import {DVM, DVM__getPMMStateResultStateStruct} from "../../types/dodoex/DVMFactory/DVM"
import {
    User,
    Token,
    Pair,
    LpToken,
    DodoZoo,
    PairTrader,
    Pool,
    TokenTrader
} from '../../types/dodoex/schema'
import {DVMFactory} from "../../types/dodoex/DVMFactory/DVMFactory"
import {DPPFactory} from "../../types/dodoex/DPPFactory/DPPFactory"
import {DODOZoo as DODOZooContract} from "../../types/dodoex/DODOZoo/DODOZoo"
import {DODOMine} from "../../types/dodoex/DODOMine/DODOMine"

import {
    DODOZooID,
    DPP_FACTORY_ADDRESS,
    DVM_FACTORY_ADDRESS,
    CLASSIC_FACTORY_ADDRESS,
    BASE_COIN,
    CHAIN_BASE_COIN_NAME,
    CHAIN_BASE_COIN_SYMBOL,

    TRANSACTION_TYPE_SWAP,
    TRANSACTION_TYPE_LP_ADD,
    TRANSACTION_TYPE_LP_REMOVE,
    TRANSACTION_TYPE_CP_CLAIM,
    TRANSACTION_TYPE_CP_CANCEL,
    TRANSACTION_TYPE_CP_BID, ADDRESS_ZERO
} from "../constant"
import {updatePairDayData, updatePairHourData, updateTokenDayData, updateUserDayData} from "./dayUpdates";
import {TYPE_DVM_POOL, TYPE_VIRTUAL_POOL, TYPE_CLASSICAL_POOL, SOURCE_SMART_ROUTE, SOURCE_POOL_SWAP} from "../constant"
import {OrderHistory as OrderHistoryV2} from "../../types/dodoex/DODOV2Proxy02/DODOV2Proxy02"

export let dvmFactoryContract = DVMFactory.bind(Address.fromString(DVM_FACTORY_ADDRESS));
export let dppFactoryContract = DPPFactory.bind(Address.fromString(DPP_FACTORY_ADDRESS));
export let classicFactoryContract = DODOZooContract.bind(Address.fromString(CLASSIC_FACTORY_ADDRESS));

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

//subgraph dosen't support indexOf() now
export function getAddressFirstIndex(addresses: string[], address: string): BigInt {
    let index = BigInt.fromI32(-1);
    let length = addresses.length;

    for (let i = 0; i < length; i++) {

        if (addresses[i] == address) {
            index = BigInt.fromI32(i);
            break
        }

    }
    return index
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
}

export function bigDecimalExp18(): BigDecimal {
    return BigDecimal.fromString('1000000000000000000')
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
    return eth.toBigDecimal().div(exponentToBigDecimal(18))
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function equalToZero(value: BigDecimal): boolean {
    const formattedVal = parseFloat(value.toString())
    const zero = parseFloat(ZERO_BD.toString())
    if (zero == formattedVal) {
        return true
    }
    return false
}

export function isNullEthValue(value: string): boolean {
    return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function fetchTokenSymbol(tokenAddress: Address): string {
    // hard coded overrides
    if (tokenAddress.toHexString() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
        return 'DGD'
    }
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
        return 'AAVE'
    }
    if (tokenAddress.toHexString() == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
        return 'USDC'
    }

    let contract = ERC20.bind(tokenAddress)
    let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

    // try types string and bytes32 for symbol
    let symbolValue = 'unknown'
    let symbolResult = contract.try_symbol()
    if (symbolResult.reverted) {
        let symbolResultBytes = contractSymbolBytes.try_symbol()
        if (!symbolResultBytes.reverted) {
            // for broken pairs that have no symbol function exposed
            if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
                symbolValue = symbolResultBytes.value.toString()
            }
        }
    } else {
        symbolValue = symbolResult.value
    }

    return symbolValue
}

export function fetchTokenName(tokenAddress: Address): string {
    // hard coded overrides
    if (tokenAddress.toHexString() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
        return 'DGD'
    }
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
        return 'Aave Token'
    }

    let contract = ERC20.bind(tokenAddress)
    let contractNameBytes = ERC20NameBytes.bind(tokenAddress)

    // try types string and bytes32 for name
    let nameValue = 'unknown'
    let nameResult = contract.try_name()
    if (nameResult.reverted) {
        let nameResultBytes = contractNameBytes.try_name()
        if (!nameResultBytes.reverted) {
            // for broken exchanges that have no name function exposed
            if (!isNullEthValue(nameResultBytes.value.toHexString())) {
                nameValue = nameResultBytes.value.toString()
            }
        }
    } else {
        nameValue = nameResult.value
    }

    return nameValue
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let totalSupplyResult = contract.try_totalSupply()
    if (totalSupplyResult.reverted) {
        return BigInt.fromI32(0)
    }
    return totalSupplyResult.value
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    // hardcode overrides
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
        return BigInt.fromI32(18)
    }
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(18)
    }

    let contract = ERC20.bind(tokenAddress)
    // try types uint8 for decimals
    let decimalValue = null
    let decimalResult = contract.try_decimals()
    if (!decimalResult.reverted) {
        decimalValue = decimalResult.value
    }
    return BigInt.fromI32(decimalValue as i32)
}

export function fetchTokenBalance(tokenAddress: Address, user: Address): BigInt {
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let balance = 0;
    let balanceResult = contract.try_balanceOf(user);
    if (balanceResult.reverted) {
        return BigInt.fromI32(0)
    }

    return balanceResult.value;
}

export function getDODOZoo(): DodoZoo {
    let dodoZoo = DodoZoo.load(DODOZooID);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZooID);
        dodoZoo.pairCount = ZERO_BI;
        dodoZoo.tokenCount = ZERO_BI;
        dodoZoo.crowdpoolingCount = ZERO_BI;
        dodoZoo.txCount = ZERO_BI;
        dodoZoo.volumeUSD = ZERO_BD;
        dodoZoo.feeUSD = ZERO_BD;
        dodoZoo.save();
    }
    return dodoZoo as DodoZoo;

}

export function createUser(address: Address, event: ethereum.Event): User {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.txCount = ZERO_BI
        user.tradingRewardRecieved = ZERO_BD
        user.timestamp = event.block.timestamp
        user.save()
    }
    return user as User;
}

export function createToken(address: Address, event: ethereum.Event): Token {
    let token = Token.load(address.toHexString());
    if (token == null) {
        if (address.toHexString() == BASE_COIN) {
            token = new Token(address.toHexString());
            token.symbol = CHAIN_BASE_COIN_SYMBOL;
            token.name = CHAIN_BASE_COIN_NAME;
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);

            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        } else {
            token = new Token(address.toHexString());
            token.symbol = fetchTokenSymbol(address);
            token.name = fetchTokenName(address);
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);

            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        }
        token.priceUpdateTimestamp = ZERO_BI;
        token.usdPrice = ZERO_BD;
        token.volumeUSDBridge = ZERO_BD;
        token.tradeVolumeBridge = ZERO_BD;
        token.txCount = ZERO_BI;
        token.untrackedVolume = ZERO_BD;
        token.timestamp = event.block.timestamp;
        token.volumeUSD = ZERO_BD;
        token.traderCount = ZERO_BI;

        token.save();

        let dodoZoo = getDODOZoo();
        dodoZoo.tokenCount = dodoZoo.tokenCount.plus(ONE_BI);
        dodoZoo.save();
    }

    //for V1 classical hardcode pools
    if (token.symbol == "unknown") {
        token.symbol = fetchTokenSymbol(address);
        token.totalSupply = fetchTokenTotalSupply(address);
        token.name = fetchTokenName(address);
        token.decimals = fetchTokenDecimals(address);
        token.save();
    }

    return token as Token;
}

export function createTokenByCall(address: Address, call: ethereum.Call): Token {
    let token = Token.load(address.toHexString());
    if (token == null) {
        if (address.toHexString() == BASE_COIN) {
            token = new Token(address.toHexString());
            token.symbol = "ETH";
            token.name = "ether";
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);

            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        } else {
            token = new Token(address.toHexString());
            token.symbol = fetchTokenSymbol(address);
            token.name = fetchTokenName(address);
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);

            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        }
        token.priceUpdateTimestamp = ZERO_BI;
        token.usdPrice = ZERO_BD;
        token.txCount = ZERO_BI;
        token.untrackedVolume = ZERO_BD;
        token.timestamp = call.block.timestamp;
        token.volumeUSD = ZERO_BD;
        token.save();

        let dodoZoo = getDODOZoo();
        dodoZoo.tokenCount = dodoZoo.tokenCount.plus(ONE_BI);
        dodoZoo.save();
    }

    //for V1 classical hardcode pools
    if (token.symbol == "unknown") {
        token.symbol = fetchTokenSymbol(address);
        token.totalSupply = fetchTokenTotalSupply(address);
        token.name = fetchTokenName(address);
        token.decimals = fetchTokenDecimals(address);
        token.save();
    }

    return token as Token;
}

export function updateVirtualPairVolume(event: OrderHistoryV2, dealedFromAmount: BigDecimal, dealedToAmount: BigDecimal, volumeUSD: BigDecimal): Pair {
    let id = event.params.fromToken.toHexString().concat("-").concat(event.params.toToken.toHexString())
    let pair = Pair.load(id);
    let baseToken = createToken(event.params.fromToken, event);
    let quoteToken = createToken(event.params.toToken, event);
    if (pair === null) {
        pair = new Pair(id) as Pair;

        pair.baseToken = baseToken.id;
        pair.quoteToken = quoteToken.id;
        pair.type = TYPE_VIRTUAL_POOL;

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
        pair.feeUSD = ZERO_BD;

        pair.i = ZERO_BI;
        pair.k = ZERO_BI;
        pair.baseReserve = ZERO_BD;
        pair.quoteReserve = ZERO_BD;

        pair.lpFeeRate = ZERO_BD;

        pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
        pair.maintainer = Address.fromString(ADDRESS_ZERO);

    }

    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(dealedFromAmount);
    pair.volumeQuoteToken = pair.volumeQuoteToken.plus(dealedToAmount);
    pair.volumeUSD = pair.volumeUSD.plus(volumeUSD);
    pair.lastTradePrice = dealedFromAmount.gt(ZERO_BD) ? dealedToAmount.div(dealedFromAmount) : ZERO_BD;

    if (volumeUSD.equals(ZERO_BD)) {
        pair.untrackedBaseVolume = pair.untrackedBaseVolume.plus(dealedFromAmount);
        pair.untrackedQuoteVolume = pair.untrackedQuoteVolume.plus(dealedToAmount);
    }
    pair.save();

    // updateStatistics(event,pair  as Pair,pair.volumeBaseToken,pair.volumeQuoteToken,ZERO_BD,ZERO_BD,ZERO_BD,ZERO_BD,baseToken,quoteToken,event.params.sender,volumeUSD);

    return pair as Pair;
}

export function createLpToken(address: Address, pair: Pair): LpToken {
    let lpToken = LpToken.load(address.toHexString());

    if (lpToken == null) {
        lpToken = new LpToken(address.toHexString())

        lpToken.decimals = fetchTokenDecimals(address);
        lpToken.name = fetchTokenName(address);
        lpToken.symbol = fetchTokenSymbol(address);
        lpToken.totalSupply = ZERO_BI;
        lpToken.pair = pair.id;
        lpToken.save();
    }

    //for V1 classical hardcode pools
    if (lpToken.symbol == "unknown") {
        lpToken.symbol = fetchTokenSymbol(address);
        lpToken.totalSupply = fetchTokenTotalSupply(address);
        lpToken.name = fetchTokenName(address);
        lpToken.decimals = fetchTokenDecimals(address);
        lpToken.save();
    }

    return lpToken as LpToken;
}

export function getPMMState(poolAddress: Address): DVM__getPMMStateResultStateStruct {
    let pair = Pair.load(poolAddress.toHexString());
    if (pair.type != TYPE_CLASSICAL_POOL) {
        let pool = DVM.bind(poolAddress);
        let pmmState = pool.getPMMState();
        return pmmState as DVM__getPMMStateResultStateStruct;
    }
    return null;
}

export function getQuoteTokenAddress(poolAddress: Address): Address {
    let pair = Pair.load(poolAddress.toHexString());
    if (pair.type != TYPE_CLASSICAL_POOL) {
        let pool = DVM.bind(poolAddress);
        let quoteToken = pool._QUOTE_TOKEN_();
        return quoteToken as Address;
    }
    return null;
}

export function updatePairTraderCount(from: Address, to: Address, pair: Pair, event: ethereum.Event): void {
    let fromPairID = from.toHexString().concat("-").concat(pair.id);
    let toPairID = to.toHexString().concat("-").concat(pair.id);

    let fromTraderPair = PairTrader.load(fromPairID);
    if (fromTraderPair == null) {
        fromTraderPair = new PairTrader(fromPairID);
        fromTraderPair.pair = pair.id;
        fromTraderPair.trader = createUser(from, event).id;
        fromTraderPair.lastTxTime = ZERO_BI;
        fromTraderPair.save();

        pair.traderCount = pair.traderCount.plus(ONE_BI);
    }

    let toTraderPair = PairTrader.load(toPairID);
    if (toTraderPair == null) {
        toTraderPair = new PairTrader(toPairID);
        toTraderPair.pair = pair.id;
        toTraderPair.trader = createUser(to, event).id;
        toTraderPair.lastTxTime = ZERO_BI;
        toTraderPair.save();
        pair.traderCount = pair.traderCount.plus(ONE_BI);
    }
    pair.save();
}

export function updateTokenTraderCount(tokenAddress: Address, userAddress: Address, event: ethereum.Event): void {
    //todo
    let tokenTraderID = tokenAddress.toHexString().concat("-").concat(userAddress.toHexString());

    let tokenTrader = TokenTrader.load(tokenTraderID);
    if (tokenTrader == null) {

        let token = createToken(tokenAddress, event);
        let user = createUser(userAddress, event);
        token.traderCount = token.traderCount.plus(ONE_BI);
        token.save();

        tokenTrader = new TokenTrader(tokenTraderID);
        tokenTrader.token = token.id;
        tokenTrader.trader = user.id;

    }
    tokenTrader.lastTxTime = event.block.timestamp;
    tokenTrader.save();

}

export function updateStatistics(event: ethereum.Event, pair: Pair, baseVolume: BigDecimal, quoteVolume: BigDecimal, feeBase: BigDecimal, feeQuote: BigDecimal, untrackedBaseVolume: BigDecimal, untrackedQuoteVolume: BigDecimal, baseToken: Token, quoteToken: Token, to: Address, volumeUSD: BigDecimal): void {
    let pairHourData = updatePairHourData(event);
    pairHourData.untrackedBaseVolume = pairHourData.untrackedBaseVolume.plus(untrackedBaseVolume);
    pairHourData.untrackedQuoteVolume = pairHourData.untrackedBaseVolume.plus(untrackedQuoteVolume);
    pairHourData.volumeBase = pairHourData.volumeBase.plus(baseVolume);
    pairHourData.volumeQuote = pairHourData.volumeQuote.plus(quoteVolume);
    pairHourData.feeBase = pairHourData.feeBase.plus(feeBase);
    pairHourData.feeQuote = pairHourData.feeQuote.plus(feeQuote);
    pairHourData.volumeUSD = pairHourData.volumeUSD.plus(volumeUSD);

    let pairDayData = updatePairDayData(event);
    pairDayData.untrackedBaseVolume = pairDayData.untrackedBaseVolume.plus(untrackedBaseVolume);
    pairDayData.untrackedQuoteVolume = pairDayData.untrackedBaseVolume.plus(untrackedQuoteVolume);
    pairDayData.volumeBase = pairDayData.volumeBase.plus(baseVolume);
    pairDayData.volumeQuote = pairDayData.volumeQuote.plus(quoteVolume);
    pairDayData.feeBase = pairDayData.feeBase.plus(feeBase);
    pairDayData.feeQuote = pairDayData.feeQuote.plus(feeQuote);
    pairDayData.volumeUSD = pairDayData.volumeUSD.plus(volumeUSD);

    let baseDayData = updateTokenDayData(baseToken, event);
    baseDayData.untrackedVolume = baseDayData.untrackedVolume.plus(untrackedBaseVolume);
    baseDayData.volume = baseDayData.volume.plus(baseVolume);
    baseDayData.fee = baseDayData.fee.plus(feeBase);
    baseDayData.txns = baseDayData.txns.plus(ONE_BI);
    baseDayData.volumeUSD = baseDayData.volumeUSD.plus(volumeUSD);

    let quoteDayData = updateTokenDayData(quoteToken, event);
    quoteDayData.untrackedVolume = baseDayData.untrackedVolume.plus(untrackedQuoteVolume);
    quoteDayData.volume = quoteDayData.volume.plus(quoteVolume);
    quoteDayData.fee = quoteDayData.fee.plus(feeQuote);
    quoteDayData.txns = quoteDayData.txns.plus(ONE_BI);
    quoteDayData.volumeUSD = quoteDayData.volumeUSD.plus(volumeUSD);

    let fromTraderPair = PairTrader.load(event.transaction.from.toHexString().concat("-").concat(pair.id));
    if (fromTraderPair.lastTxTime.lt(BigInt.fromI32(pairHourData.hour))) {
        pairHourData.traders = pairHourData.traders.plus(ONE_BI);
    }
    if (fromTraderPair.lastTxTime.lt(BigInt.fromI32(pairDayData.date))) {
        pairDayData.traders = pairDayData.traders.plus(ONE_BI);
        baseDayData.traders = baseDayData.traders.plus(ONE_BI);
        quoteDayData.traders = quoteDayData.traders.plus(ONE_BI);
    }
    fromTraderPair.lastTxTime = event.block.timestamp;
    fromTraderPair.save();

    let toTraderPair = PairTrader.load(to.toHexString().concat("-").concat(pair.id));
    if (toTraderPair.lastTxTime.lt(BigInt.fromI32(pairHourData.hour))) {
        pairHourData.traders = pairHourData.traders.plus(ONE_BI);
    }
    if (toTraderPair.lastTxTime.lt(BigInt.fromI32(pairDayData.date))) {
        pairDayData.traders = pairDayData.traders.plus(ONE_BI);
        baseDayData.traders = baseDayData.traders.plus(ONE_BI);
        quoteDayData.traders = quoteDayData.traders.plus(ONE_BI);
    }
    toTraderPair.lastTxTime = event.block.timestamp;
    toTraderPair.save();

    pairHourData.save();
    pairDayData.save();
    baseDayData.save();
    quoteDayData.save();
}

export function createPool(pid: BigInt): Pool {

    let pool = Pool.load(pid.toString());
    if (pool == null) {
        pool = new Pool(pid.toString());
        let dodoMineContract = DODOMine.bind(dataSource.address());
        let poolInfo = dodoMineContract.poolInfos(pid)
        pool.lpToken = poolInfo.value0.toHexString();
        pool.staked = ZERO_BD;
        pool.save();
    }

    return pool as Pool;
}

export function updateUserDayDataAndDodoDayData(event: ethereum.Event, type: string): void {
    let userDayData = updateUserDayData(event);
    if (type === TRANSACTION_TYPE_SWAP) {
        userDayData.tradeCount = userDayData.tradeCount.plus(ONE_BI)
    }
    if (type === TRANSACTION_TYPE_LP_ADD) {
        userDayData.tradeCount = userDayData.addLPCount.plus(ONE_BI)
    }
    if (type === TRANSACTION_TYPE_LP_REMOVE) {
        userDayData.tradeCount = userDayData.removeLPCount.plus(ONE_BI)
    }
    if (type === TRANSACTION_TYPE_CP_BID) {
        userDayData.tradeCount = userDayData.bidCount.plus(ONE_BI)
    }
    if (type === TRANSACTION_TYPE_CP_CANCEL) {
        userDayData.tradeCount = userDayData.cancelCount.plus(ONE_BI)
    }
    if (type === TRANSACTION_TYPE_CP_CLAIM) {
        userDayData.tradeCount = userDayData.claimCount.plus(ONE_BI)
    }
    userDayData.save();
}
