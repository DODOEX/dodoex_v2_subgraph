/* eslint-disable prefer-const */
import {log, BigInt, BigDecimal, Address, ethereum} from '@graphprotocol/graph-ts'
import {ERC20} from "../types/DODOV1Proxy01/ERC20"
import {ERC20NameBytes} from "../types/DODOV1Proxy01/ERC20NameBytes"
import {ERC20SymbolBytes} from "../types/DODOV1Proxy01/ERC20SymbolBytes"
import {DVM, DVM__getPMMStateResultStateStruct} from "../types/DVMFactory/DVM"
import {
    User,
    Token,
    Pair,
    LpToken,
    DodoZoo,
    PairTrader

} from '../types/schema'
import {DVMFactory} from "../types/DVMFactory/DVMFactory"
import {DPPFactory} from "../types/DPPFactory/DPPFactory"
import {DODOZoo as DODOZooContract} from "../types/DODOZoo/DODOZoo"
import {DPP} from "../types/templates/DPP/DPP"

import {
    DODOZooID,
    DPP_FACTORY_ADDRESS,
    DVM_FACTORY_ADDRESS,
    CLASSIC_FACTORY_ADDRESS,
    ETH_ADDRESS
} from "./constant"

export let dvmFactoryContract = DVMFactory.bind(Address.fromString(DVM_FACTORY_ADDRESS));
export let dppFactoryContract = DPPFactory.bind(Address.fromString(DPP_FACTORY_ADDRESS));
export let classicFactoryContract = DODOZooContract.bind(Address.fromString(CLASSIC_FACTORY_ADDRESS));

//poo type
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";

//OrderHistory source type
export const SOURCE_SMART_ROUTE = "smart route"
export const SOURCE_POOL_SWAP = "pool swap"

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

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
    if (tokenAddress.toHexString() == ETH_ADDRESS) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let totalSupplyValue = 0
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
    if (tokenAddress.toHexString() == ETH_ADDRESS) {
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

export function fetchTokenBalance(tokenAddress: Address,user: Address): BigInt {
    if (tokenAddress.toHexString() == ETH_ADDRESS) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let balance = 0;
    let balanceResult = contract.try_balanceOf(user);
    if (!balanceResult.reverted) {
        balance = balanceResult as i32
    }
    return BigInt.fromI32(balance as i32)
}

export function getDODOZoo(): DodoZoo {
    let dodoZoo = DodoZoo.load(DODOZooID);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZooID);
        dodoZoo.pairCount = ZERO_BI;
        dodoZoo.tokenCount = ZERO_BI;
        dodoZoo.crowdpoolingCount = ZERO_BI;
        dodoZoo.txCount = ZERO_BI;
        dodoZoo.save();
    }
    return dodoZoo as DodoZoo;

}

export function createUser(address: Address): User {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.usdcSwapped = ZERO_BD
        user.txCount = ZERO_BI
        user.tradingRewardRecieved = ZERO_BD
        user.save()
    }
    return user as User;
}

export function createToken(address: Address, event: ethereum.Event): Token {
    let token = Token.load(address.toHexString());
    if (token == null) {
        if (address.toHexString() == ETH_ADDRESS) {
            token = new Token(address.toHexString());
            token.symbol = "ETH";
            token.name = "ether";
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);
            if (decimals === null) {
                log.debug('mybug the decimal on token 0 was null', []);
            }
            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.tradeVolumeUSDC = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        } else {
            token = new Token(address.toHexString());
            token.symbol = fetchTokenSymbol(address);
            token.name = fetchTokenName(address);
            token.totalSupply = fetchTokenTotalSupply(address);

            let decimals = fetchTokenDecimals(address);
            if (decimals === null) {
                log.debug('mybug the decimal on token 0 was null', []);
            }
            token.decimals = decimals;
            token.tradeVolume = ZERO_BD;
            token.tradeVolumeUSDC = ZERO_BD;
            token.totalLiquidityOnDODO = ZERO_BD;
        }
        token.txCount = ZERO_BI;
        token.priceUSDC = ZERO_BD;
        token.untrackedVolume = ZERO_BD;
        token.timestamp = event.block.timestamp;
        token.feeUSDC = ZERO_BD
        token.save();

        let dodoZoo = getDODOZoo();
        dodoZoo.tokenCount = dodoZoo.tokenCount.plus(ONE_BI);
        dodoZoo.save();
    }

    //for V1 classical hardcode pools
    if(token.symbol=="unknown"){
        token.symbol = fetchTokenSymbol(address);
        token.totalSupply = fetchTokenTotalSupply(address);
        token.name = fetchTokenName(address);
        token.decimals = fetchTokenDecimals(address);
        token.save();
    }

    return token as Token;
}

export function createLpToken(address: Address,pair: Pair): LpToken {
    let lpToken = LpToken.load(address.toHexString());

    if (lpToken == null) {
        lpToken = new LpToken(address.toHexString())

        lpToken.decimals = fetchTokenDecimals(address);
        lpToken.name = fetchTokenName(address);
        lpToken.symbol = fetchTokenSymbol(address);
        lpToken.totalSupply = fetchTokenTotalSupply(address);
        lpToken.pair = pair.id;
        lpToken.save();
    }

    //for V1 classical hardcode pools
    if(lpToken.symbol=="unknown"){
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
    if(pair.type == TYPE_DVM_POOL){
        let pool = DVM.bind(poolAddress);
        let pmmState = pool.getPMMState();
        return pmmState as DVM__getPMMStateResultStateStruct;
    }
    if(pair.type == TYPE_DPP_POOL){
        let pool = DVM.bind(poolAddress);
        let pmmState = pool.getPMMState();
        return pmmState as DVM__getPMMStateResultStateStruct;
    }
    return null;
}

export function updatePairTraderCount(from: Address, to: Address, pair: Pair): void {
    let fromPairID = from.toHexString().concat("-").concat(pair.id);
    let toPairID = to.toHexString().concat("-").concat(pair.id);

    let fromTraderPair = PairTrader.load(fromPairID);
    if (fromTraderPair == null) {
        fromTraderPair = new PairTrader(fromPairID);
        fromTraderPair.pair = pair.id;
        fromTraderPair.trader = createUser(from).id;
        fromTraderPair.save();

        pair.traderCount = pair.traderCount.plus(ONE_BI);
    }

    let toTraderPair = PairTrader.load(toPairID);
    if (toTraderPair == null) {
        toTraderPair = new PairTrader(toPairID);
        toTraderPair.pair = pair.id;
        toTraderPair.trader = createUser(to).id;
        toTraderPair.save();
        pair.traderCount = pair.traderCount.plus(ONE_BI);
    }
    pair.save();
}
