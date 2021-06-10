/* eslint-disable prefer-const */
import {log, BigInt, BigDecimal, Address, ethereum} from '@graphprotocol/graph-ts'
import {ERC20} from "../../types/token/ERC20Factory/ERC20"
import {ERC20NameBytes} from "../../types/token/ERC20Factory/ERC20NameBytes"
import {ERC20SymbolBytes} from "../../types/token/ERC20Factory/ERC20SymbolBytes"
import {User} from "../../types/token/schema"

import {
    BASE_COIN,
    CHAIN_BASE_COIN_SYMBOL,
    CHAIN_BASE_COIN_NAME
} from "../constant"

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

export function fetchTokenSymbolByCall(tokenAddress: Address): string {
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

    // try types string and bytes32 for symbol
    let symbolValue = contract.symbol()

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

export function fetchTokenNameByCall(tokenAddress: Address): string {
    // hard coded overrides
    if (tokenAddress.toHexString() == '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
        return 'DGD'
    }
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
        return 'Aave Token'
    }

    let contract = ERC20.bind(tokenAddress)

    // try types string and bytes32 for name
    let nameValue = contract.name()

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

export function fetchTokenTotalSupplyByCall(tokenAddress: Address): BigInt {
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let totalSupplyResult = contract.totalSupply()

    return totalSupplyResult
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

export function fetchTokenDecimalsByCall(tokenAddress: Address): BigInt {
    // hardcode overrides
    if (tokenAddress.toHexString() == '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
        return BigInt.fromI32(18)
    }
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(18)
    }

    let contract = ERC20.bind(tokenAddress)
    let decimalResult = contract.decimals()

    return BigInt.fromI32(decimalResult as i32)
}

export function fetchTokenBalance(tokenAddress: Address,user: Address): BigInt {
    if (tokenAddress.toHexString() == BASE_COIN) {
        return BigInt.fromI32(0)
    }
    let contract = ERC20.bind(tokenAddress)
    let balanceResult = contract.try_balanceOf(user);
    if (balanceResult.reverted) {
        return BigInt.fromI32(0)
    }

    return balanceResult.value;
}

export function createUser(address: Address,event: ethereum.Event): User {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.timestamp = event.block.timestamp
        user.save()
    }
    return user as User;
}






