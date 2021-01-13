/* eslint-disable prefer-const */
import {Pair, Token} from '../types/schema'
import {BigDecimal, Address, BigInt} from '@graphprotocol/graph-ts/index'
import {
    ZERO_BD,
    ADDRESS_ZERO,
    ONE_BD,
    convertTokenToDecimal,
    TYPE_DVM_POOL,
    TYPE_DPP_POOL,
    TYPE_CLASSICAL_POOL,
    dppFactoryContract,
    dvmFactoryContract
} from './helpers'
import {DODO} from '../types/DODOV1Proxy01/DODO'
import {DVM} from '../types/DVMFactory/DVM'
import {DPP} from '../types/DPPFactory/DPP'


const WETH_ADDRESS = '0x9d48172b0189de70f8788de10196a1fb622b8e6b';
const USDT_ADDRESS = '0x9d48172b0189de70f8788de10196a1fb622b8e6b';
// const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const USDC_ADDRESS = '0x43688f367eb83697c3ca5d03c5055b6bd6f6ac4b';

const WETH_USDC_PAIR = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'; // created 10008355
const USDT_USDC_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'; // created block 10042267

const WHITELIST: string[]= [
    WETH_ADDRESS,
    USDT_ADDRESS
];

const WHITELIST_PAIR: string[] = [
    WETH_USDC_PAIR,
    USDT_USDC_PAIR
]

function getPriceFromPair(i: i32): BigDecimal {

    switch (i) {
        case 1:
            let contract1 = DODO.bind(Address.fromString(WHITELIST_PAIR[i]));
            return convertTokenToDecimal(contract1.getMidPrice(),BigInt.fromI32(18));
        case 2:
            let contract2 = DODO.bind(Address.fromString(USDT_USDC_PAIR[i]));
            return convertTokenToDecimal(contract2.getMidPrice(),BigInt.fromI32(18));
        default:
            return ZERO_BD;
    }
}

function getPriceFromWhiteList(token: Token): BigDecimal {

    let pair: DVM;
    //1、查找交易对
    for (let i = 0; i < WHITELIST.length; i++) {
        let addresses = dvmFactoryContract.getVendingMachine(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
        if (addresses.length > 0) {
            pair = DVM.bind(addresses[0]);
            let price1 = pair.getMidPrice();
            let price2 = getPriceFromPair(i);
            return convertTokenToDecimal(price1, BigInt.fromI32(18)).minus(price2)
        }
    }

    return ZERO_BD;

}

export function getUSDCPrice(pair: Pair, isBase: boolean): BigDecimal {

    if (pair.baseToken == USDC_ADDRESS && isBase == true) {
        return ONE_BD;
    }

    if (pair.quoteToken == USDC_ADDRESS && isBase == false) {
        return ONE_BD;
    }

    if (pair.quoteToken == USDC_ADDRESS) {
        let contract: DVM;
        contract = DVM.bind(Address.fromString(pair.id))

        // if (pair.type == TYPE_DVM_POOL) {
        //     contract = DVM.bind(Address.fromString(pair.id))
        // } else if (pair.type == TYPE_DPP_POOL) {
        //     contract = DPP.bind(Address.fromString(pair.id))
        // } else if (pair.type == TYPE_CLASSICAL_POOL) {
        //     contract = DODO.bind(Address.fromString(pair.id))
        // }

        return convertTokenToDecimal(contract.getMidPrice(), BigInt.fromI32(18));
    }

    if (isBase == true) {
        return getPriceFromWhiteList(Token.load(pair.baseToken) as Token);
    }

    return getPriceFromWhiteList(Token.load(pair.quoteToken) as Token);
}


