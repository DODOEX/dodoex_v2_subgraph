/* eslint-disable prefer-const */
import { log, BigInt, BigDecimal, Address, ethereum} from '@graphprotocol/graph-ts'
import {ERC20} from '../types/DodoZoo/ERC20'
import {ERC20SymbolBytes} from '../types/DodoZoo/ERC20SymbolBytes'
import {ERC20NameBytes} from '../types/DodoZoo/ERC20NameBytes'
import {DODO} from '../types/templates/DODO/DODO'
import {User, Bundle, Token, LiquidityPosition, LiquidityPositionSnapshot, Pair, LpToken} from '../types/schema'
import {DODOZoo as DodoZooContract} from '../types/templates/DODO/DodoZoo'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const DODOZoo_ADDRESS = '0x3a97247df274a17c59a3bd12735ea3fcdfb49950'
export const DODOZoo_BATCH_ADDRESS = '0xBD337924F000dcEB119153d4D3B1744b22364d25'

export const USDT_ADDRESS='0xdac17f958d2ee523a2206206994597c13d831ec7';
export const WBTC_ADDRESS='0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let dodoZooContract = DodoZooContract.bind(Address.fromString(DODOZoo_ADDRESS))

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
    let contract = ERC20.bind(tokenAddress)
    let totalSupplyValue = null
    let totalSupplyResult = contract.try_totalSupply()
    if (!totalSupplyResult.reverted) {
        totalSupplyValue = totalSupplyResult as i32
    }
    return BigInt.fromI32(totalSupplyValue as i32)
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    // hardcode overrides
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
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

export function createUser(address: Address): void {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.usdSwapped = ZERO_BD
        user.save()
    }
}

export function getDODOPair(pairAddress: Address): Pair {
    let pair = Pair.load(pairAddress.toHexString());
    let pairContract = DODO.bind(pairAddress);
    if (pair.baseLpToken == null) {
        pair.baseLpToken = pairContract._BASE_CAPITAL_TOKEN_().toHexString();
    }
    if (pair.quoteLpToken == null) {
        pair.quoteLpToken = pairContract._QUOTE_CAPITAL_TOKEN_().toHexString();
    }
    return pair as Pair;
}

export function getLpToken(address: Address): LpToken {
    let capitalToken = LpToken.load(address.toHexString())
    if (capitalToken === null) {
        capitalToken = new LpToken(address.toHexString())
        log.warning(address.toHexString(),[]);
        capitalToken.decimals = fetchTokenDecimals(address);
        capitalToken.name = fetchTokenName(address);
        capitalToken.symbol = fetchTokenSymbol(address);
        capitalToken.totalSupply = fetchTokenTotalSupply(address);
        capitalToken.save()
    }
    return capitalToken as LpToken;
}

export function createLiquidityPosition(exchange: Address, user: Address): LiquidityPosition {
    let id = exchange
        .toHexString()
        .concat('-')
        .concat(user.toHexString())
    let liquidityTokenBalance = LiquidityPosition.load(id)
    if (liquidityTokenBalance === null) {
        let pair = Pair.load(exchange.toHexString())
        pair.baseLiquidityProviderCount = pair.baseLiquidityProviderCount.plus(ZERO_BI);
        pair.quoteLiquidityProviderCount = pair.quoteLiquidityProviderCount.plus(ZERO_BI);

        liquidityTokenBalance = new LiquidityPosition(id);
        liquidityTokenBalance.baseLpTokenBalance = ZERO_BD;//todo when fill data
        liquidityTokenBalance.quoteLpTokenBalance = ZERO_BD;//todo when fill data
        liquidityTokenBalance.pair = exchange.toHexString();
        liquidityTokenBalance.user = user.toHexString();
        liquidityTokenBalance.save();
        pair.save()
    }
    if (liquidityTokenBalance === null) log.error('LiquidityTokenBalance is null', [id])
    return liquidityTokenBalance as LiquidityPosition
}

export function createLiquiditySnapshot(position: LiquidityPosition, event: ethereum.Event): void {
    let timestamp = event.block.timestamp.toI32()
    let bundle = Bundle.load('1')
    let pair = Pair.load(position.pair)
    let baseToken = Token.load(pair.baseToken)
    let quoteToken = Token.load(pair.quoteToken)

    // create new snapshot
    let snapshot = new LiquidityPositionSnapshot(position.id.concat(timestamp.toString()))
    snapshot.liquidityPosition = position.id;
    snapshot.timestamp = timestamp;
    snapshot.block = event.block.number.toI32();
    snapshot.user = position.user;
    snapshot.pair = position.pair;
    snapshot.baseReserve = pair.baseReserve as BigDecimal;
    snapshot.quoteReserve = pair.quoteReserve as BigDecimal;
    snapshot.baseLpTokenTotalSupply = pair.baseLpTokenTotalSupply as BigDecimal;
    snapshot.quoteLpTokenTotalSupply = pair.quoteLpTokenTotalSupply as BigDecimal;
    snapshot.liquidityPosition = position.id;
    snapshot.save();
    position.save()
}

export function dealPriceDecimals(baseToken: String,midPrice: BigDecimal): BigDecimal {
    let price: BigDecimal;

    if(baseToken===Address.fromString(USDT_ADDRESS).toHexString()){
        price = midPrice.div(BigDecimal.fromString("1000000000000000000"))
    }else if(baseToken === Address.fromString(WBTC_ADDRESS).toHexString()){
        price = midPrice.div(BigDecimal.fromString("10000000000000000"))
    } else{
        price = midPrice.div(BigDecimal.fromString("1000000"))
    }
    if(baseToken === "0x85f9569b69083c3e6aeffd301bb2c65606b5d575"){
        log.warning('test wcres price data,{} {} {}',[baseToken.toString(),midPrice.toString(),price.toString()]);
    }
    return price;
}
