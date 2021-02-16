/* eslint-disable prefer-const */
import {Pair, Token} from '../../types/dodoex/schema'
import {BigDecimal, Address, BigInt, log} from '@graphprotocol/graph-ts/index'
import {
    ZERO_BD,
    ONE_BD,
    convertTokenToDecimal,
    dppFactoryContract,
    dvmFactoryContract,
    classicFactoryContract
} from './helpers'
import {DODO} from '../../types/dodoex/DODOV1Proxy01/DODO'
import {DVM} from '../../types/dodoex/DVMFactory/DVM'
import {DPP} from '../../types/dodoex/DPPFactory/DPP'

import {
    WETH_ADDRESS,
    USDT_ADDRESS,
    USDC_ADDRESS,
    WETH_USDC_PAIR,
    USDT_USDC_PAIR,
    ADDRESS_ZERO,
    DPP_FACTORY_DEPLOY_BLOCK,
    DVM_FACTORY_DEPLOY_BLOCK,
    WETH_USDC_BLOCK,
    USDT_USDC_BLOCK,
    DODOZooID,
    TYPE_DVM_POOL,
    TYPE_DPP_POOL,
    TYPE_CLASSICAL_POOL,
} from "../constant"

const WHITELIST: string[] = [
    WETH_ADDRESS,
    USDT_ADDRESS
];

const WHITELIST_PAIR: string[] = [
    WETH_USDC_PAIR,
    USDT_USDC_PAIR
]

const WHITELIST_BLOCK: i32[] = [
    WETH_USDC_BLOCK,
    USDT_USDC_BLOCK
]

function getPriceFromExistPair(i: i32): BigDecimal {
    switch (i) {
        case 1:
            let contract1 = DODO.bind(Address.fromString(WHITELIST_PAIR[i]));
            return convertTokenToDecimal(contract1.getMidPrice(), BigInt.fromI32(18));
        case 2:
            let contract2 = DODO.bind(Address.fromString(USDT_USDC_PAIR[i]));
            return convertTokenToDecimal(contract2.getMidPrice(), BigInt.fromI32(18));
        default:
            return ZERO_BD;
    }
}

function getPriceFromWhiteList(token: Token, block: BigInt): BigDecimal {

    //1、查找交易对
    for (let i = 0; i < WHITELIST.length; i++) {

        if (block.lt(BigInt.fromI32(WHITELIST_BLOCK[i]) ) ){
            continue;
        }

        //先去classic 池寻找
        let address = classicFactoryContract.getDODO(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
        if (address.toHexString() != ADDRESS_ZERO) {
            let pair: DODO;
            pair = DODO.bind(address);
            let price1 = pair.getMidPrice();
            let price2 = getPriceFromExistPair(i);
            return convertTokenToDecimal(price1, BigInt.fromI32(18)).minus(price2)
        }

        if (block.toI32() > DVM_FACTORY_DEPLOY_BLOCK) {
            let addresses = dvmFactoryContract.getDODOPool(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
            if (addresses.length != 0 && addresses[0].toHexString() != ADDRESS_ZERO) {
                let pair: DVM;
                pair = DVM.bind(addresses[0]);
                let price1 = pair.getMidPrice();
                let price2 = getPriceFromExistPair(i);
                return convertTokenToDecimal(price1, BigInt.fromI32(18)).minus(price2)
            }
        }

        //dpp reset will cause uncertain consequences
        // if (block.toI32() > DPP_FACTORY_DEPLOY_BLOCK) {
        //     let addresses = dppFactoryContract.getDODOPool(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
        //     if (addresses.length != 0 && addresses[0].toHexString() != ADDRESS_ZERO) {
        //         let pair: DPP;
        //         log.warning(`dpp pool address:{}`,[addresses[0].toHexString()])
        //         pair = DPP.bind(addresses[0]);
        //         let price1 = pair.getMidPrice();
        //         let price2 = getPriceFromExistPair(i);
        //         return convertTokenToDecimal(price1, BigInt.fromI32(18)).minus(price2)
        //     }
        // }

    }

    return ZERO_BD;

}

export function getUSDCPrice(pair: Pair, isBase: boolean, block: BigInt): BigDecimal {

    if(DODOZooID != " "){
        return ZERO_BD;
    }

    if (pair.baseToken == USDC_ADDRESS && isBase == true) {
        return ONE_BD;
    }

    if (pair.quoteToken == USDC_ADDRESS && isBase == false) {
        return ONE_BD;
    }

    if (pair.quoteToken == USDC_ADDRESS) {
        if (pair.type == TYPE_DVM_POOL) {
            let contract = DVM.bind(Address.fromString(pair.id));
            return convertTokenToDecimal(contract.getMidPrice(), BigInt.fromI32(18));
        } else if (pair.type == TYPE_DPP_POOL) {
            let contract = DPP.bind(Address.fromString(pair.id))
            return convertTokenToDecimal(contract.getMidPrice(), BigInt.fromI32(18));
        } else if (pair.type == TYPE_CLASSICAL_POOL) {
            let contract = DODO.bind(Address.fromString(pair.id))
            return convertTokenToDecimal(contract.getMidPrice(), BigInt.fromI32(18));
        }
    }

    if (isBase == true) {
        return getPriceFromWhiteList(Token.load(pair.baseToken) as Token, block);
    }

    return getPriceFromWhiteList(Token.load(pair.quoteToken) as Token, block);
}


