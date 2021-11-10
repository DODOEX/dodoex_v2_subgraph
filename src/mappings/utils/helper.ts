import {BigDecimal, BigInt,Address} from "@graphprotocol/graph-ts/index";

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)
export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')
export const BASE_COIN = Address.fromString('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');