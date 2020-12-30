/* eslint-disable prefer-const */
import { Pair, Token } from '../types/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, ADDRESS_ZERO, ONE_BD,convertTokenToDecimal } from './helpers'
import {DODO} from '../types/DODOV1Proxy01/DODO'

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

const WETH_USDC_PAIR = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'; // created 10008355
const USDT_USDC_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'; // created block 10042267

export function getWethPrice(): BigDecimal {
    let DODO_WETH_USDC = DODO.bind(Address.fromString(WETH_USDC_PAIR));
    let midPrice = DODO_WETH_USDC.getMidPrice();

    let decimalPrice = convertTokenToDecimal(midPrice,BigInt.fromI32(18));
    return decimalPrice;
}

export function getUsdtPrice(): BigDecimal{
    let DODO_USDT_USDC = DODO.bind(Address.fromString(USDT_USDC_PAIR));
    let midPrice = DODO_USDT_USDC.getMidPrice();

    let decimalPrice = convertTokenToDecimal(midPrice,BigInt.fromI32(18));
    return decimalPrice;
}

