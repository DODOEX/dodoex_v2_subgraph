/* eslint-disable prefer-const */
import {log, BigInt, BigDecimal, Address, String} from '@graphprotocol/graph-ts'
import {Pair, Token} from '../../types/dodoex/schema'
import {
    ZERO_BD,
    ONE_BD,
    convertTokenToDecimal,
} from './helpers'

import {
    STABLE_COIN_PAIR_ONE,
    STABLE_ONE_ADDRESS,
    STABLE_TWO_ADDRESS,
    BASE_COIN,
    WRAPPED_BASE_COIN,
    BASE_COIN_PAIR,
    TYPE_CLASSICAL_POOL,
    TYPE_DPP_POOL,
    TYPE_DVM_POOL,
} from "../constant"

const VALID_PRICING_TVL = BigDecimal.fromString("100000");//100k usd

const STANDARD_TOKEN: string[] = [
    STABLE_ONE_ADDRESS,
    STABLE_TWO_ADDRESS,
    BASE_COIN,
    WRAPPED_BASE_COIN
];

function priceCore(): void {
    let stableOnePair = Pair.load(STABLE_COIN_PAIR_ONE);
    let baseCurrencyPair = Pair.load(BASE_COIN_PAIR);
    let wrappedBaseCoin = Token.load(WRAPPED_BASE_COIN);

    let stableCoinOne = Token.load(STABLE_ONE_ADDRESS);
    let stableCoinTwo = Token.load(STABLE_TWO_ADDRESS);

    let baseCoin = Token.load(BASE_COIN);

    if (stableOnePair != null) {

        let lastTradePrice = stableOnePair.lastTradePrice;
        let baseWeight = stableOnePair.baseReserve.div(stableOnePair.baseReserve.plus(stableOnePair.quoteReserve));
        let quoteWeight = stableOnePair.quoteReserve.div(stableOnePair.baseReserve.plus(stableOnePair.quoteReserve));
        let baseUsdPrice = lastTradePrice.minus(ONE_BD).times(ONE_BD.minus(baseWeight)).plus(ONE_BD);
        let quoteUsdPrice = lastTradePrice.minus(ONE_BD).times(ONE_BD.minus(quoteWeight)).plus(ONE_BD);

        let baseToken = Token.load(stableOnePair.baseToken);
        let quoteToken = Token.load(stableOnePair.quoteToken);
        baseToken.usdPrice = baseUsdPrice;
        quoteToken.usdPrice = quoteUsdPrice;

        if (baseCurrencyPair != null) {
            if (stableOnePair.baseToken == baseCurrencyPair.quoteToken) {
                wrappedBaseCoin.usdPrice = baseCurrencyPair.lastTradePrice.times(baseToken.usdPrice);
            }
            if (stableOnePair.quoteToken == baseCurrencyPair.quoteToken) {
                wrappedBaseCoin.usdPrice = baseCurrencyPair.lastTradePrice.times(quoteToken.usdPrice);
            }
            wrappedBaseCoin.save();
        }

        baseToken.save();
        quoteToken.save();
    } else {
        if (baseCurrencyPair != null) {
            wrappedBaseCoin.usdPrice = baseCurrencyPair.lastTradePrice;
            wrappedBaseCoin.save();
        }
        if (stableCoinOne != null) {
            stableCoinOne.usdPrice = ONE_BD;
            stableCoinOne.save();
        }
        if (stableCoinTwo != null) {
            stableCoinTwo.usdPrice = ONE_BD;
            stableCoinTwo.save();
        }
    }
    if (baseCoin != null) {
        baseCoin.usdPrice = wrappedBaseCoin.usdPrice;
        baseCoin.save();
    }

}

function updateWhiteListPrice(pair: Pair): void {
    if (pair.type == TYPE_CLASSICAL_POOL || pair.type == TYPE_DPP_POOL) {

        let quoteToken = Token.load(pair.quoteToken);
        let baseToken = Token.load(pair.baseToken);

        if (quoteToken.usdPrice != null) {
            let quoteTVL = pair.quoteReserve.times(quoteToken.usdPrice);
            let baseTVL = pair.baseReserve.times(pair.lastTradePrice).times(quoteToken.usdPrice);
            if (quoteTVL.plus(baseTVL).ge(VALID_PRICING_TVL)) {
                baseToken.usdPrice = pair.lastTradePrice.times(quoteToken.usdPrice);
                baseToken.save();
            } else {
                baseToken.usdPrice = null;
                baseToken.save();
            }

        }
    }

}

export function updatePrice(pair: Pair): void {
    priceCore()
    updateWhiteListPrice(pair)
}

export function calculateUsdVolume(token0: Token, token1: Token, amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
    let volumeUSD = ZERO_BD;
    if (token0.usdPrice != null && token1.usdPrice == null) {
        volumeUSD = volumeUSD.plus(token0.usdPrice.times(amount0));
    } else if (token0.usdPrice == null && token1.usdPrice != null) {
        volumeUSD = volumeUSD.plus(token1.usdPrice.times(amount1));
    } else if (token0.usdPrice == null && token1.usdPrice != null) {
        volumeUSD = volumeUSD.plus(token0.usdPrice.times(amount0)).plus(token1.usdPrice.times(amount1)).div(BigDecimal.fromString("2"));
    }

    return volumeUSD;
}

