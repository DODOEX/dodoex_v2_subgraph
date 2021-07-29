/* eslint-disable prefer-const */
import {log, BigInt, BigDecimal, Address, ethereum, dataSource} from '@graphprotocol/graph-ts'
import {
    User, vDODO, DODO
} from '../../types/vdodo/schema'
import {ERC20} from "../../types/vdodo/vDODOToken/ERC20"
import {ERC20NameBytes} from "../../types/vdodo/vDODOToken/ERC20NameBytes"
import {ERC20SymbolBytes} from "../../types/vdodo/vDODOToken/ERC20SymbolBytes"
import {vDODOToken__userInfoResult, vDODOToken} from "../../types/vdodo/vDODOToken/vDODOToken"

import {
    DODO_ADDRESS_KOVAN,
    DODO_ADDRESS_MAINNET
} from "./constants"

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';
export const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
export const BASE_COIN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString('0');
export let ONE_BD = BigDecimal.fromString('1');
export let BI_18 = BigInt.fromI32(18);

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
    return eth.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(18)))
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

export function createUser(userAddr: Address,event: ethereum.Event): User {
    let user = User.load(userAddr.toHexString())

    if (user == null) {
        user = new User(userAddr.toHexString());
        user.superior = Address.fromString(ADDRESS_ZERO);
        user.credit = ZERO_BD;
        user.stakingPower = ZERO_BI;
        user.superiorSP = ZERO_BI;
        user.spFromInvited = ZERO_BI;
        user.creditFromInvited = ZERO_BD;
        user.mintAmount = ZERO_BD;
        user.redeemRecieveAmount = ZERO_BD;
        user.redeemFeeAmount = ZERO_BD;
        user.redeemBurnAmount = ZERO_BD;
        user.creditOfSuperior = ZERO_BD;
        user.timestamp = event.block.timestamp;
    }
    return user as User;
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

export function fetchUserInfo(addr: Address): vDODOToken__userInfoResult {
    let vDODOContract = vDODOToken.bind(dataSource.address());
    let resopnse = vDODOContract.userInfo(addr);
    return resopnse as vDODOToken__userInfoResult;
}

export function fetchTotalSp(): BigInt {
    let vDODOContract = vDODOToken.bind(dataSource.address());
    let resopnse = vDODOContract._TOTAL_STAKING_POWER_();
    return resopnse as BigInt;
}

export function initTokenInfo(): void {
    let vDODOAddress = dataSource.address();
    let DODOAddress = Address.fromString(dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN);

    let vdodo = vDODO.load(vDODOAddress.toHexString());
    if (vdodo == null) {
        vdodo = new vDODO(vDODOAddress.toHexString());
        vdodo.decimals = fetchTokenDecimals(vDODOAddress);
        vdodo.name = fetchTokenName(vDODOAddress);
        vdodo.symbol = fetchTokenSymbol(vDODOAddress);
        vdodo.dodo = DODOAddress;
        vdodo.totalUsers = ZERO_BI;
        vdodo.mintAmount = ZERO_BD;
        vdodo.redeemAmount = ZERO_BD;
        vdodo.totalBlockReward = ZERO_BD;
        vdodo.totalBlockDistribution = ZERO_BD;
        vdodo.totalDonate = ZERO_BD;
        vdodo.totalStakingPower = ZERO_BI;
        vdodo.dodoPerBlock = ZERO_BD;
        vdodo.feeAmount = ZERO_BD;
        vdodo.burnAmount = ZERO_BD;
    }

    let dodo = DODO.load(DODOAddress.toHexString());
    if (dodo == null) {
        dodo = new DODO(DODOAddress.toHexString());
        dodo.decimals = fetchTokenDecimals(DODOAddress);
        dodo.name = fetchTokenName(DODOAddress);
        dodo.symbol = fetchTokenSymbol(DODOAddress);
        dodo.totalSupply = fetchTokenTotalSupply(DODOAddress);
    }
    vdodo.dodoBalance = convertTokenToDecimal(fetchTokenBalance(DODOAddress, vDODOAddress), dodo.decimals);

    vdodo.save();
    dodo.save();
}


