/* eslint-disable prefer-const */

import {log, Address, BigInt, ethereum} from '@graphprotocol/graph-ts'
import {
    DODOZoo_BATCH_ADDRESS,
    DODOZoo_ADDRESS,
    ZERO_BD,
    ZERO_BI,
    fetchTokenSymbol,
    fetchTokenName,
    fetchTokenDecimals,
    fetchTokenTotalSupply, ONE_BD
} from './helpers'
import {DODOBirth} from '../types/DodoZoo/DodoZoo'
import {DodoZoo, Token, Pair} from '../types/schema'
import {DODO as DODOTemplate} from '../types/templates';
import {BuyBaseToken} from "../types/templates/DODO/DODO";

export function handleDODOBirth(event: DODOBirth): void {

    let oldPair = Pair.load(event.params.newBorn.toHexString());
    if (oldPair !== null) {
        return;
    }

    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZoo_ADDRESS);
        dodoZoo.pairCount = 0;
        dodoZoo.totalLiquidityUSD = ZERO_BD;
        dodoZoo.totalVolumeUSD = ZERO_BD;
        dodoZoo.txCount = ZERO_BI;
    }
    dodoZoo.pairCount = dodoZoo.pairCount + 1;
    dodoZoo.save();

    //tokens
    let baseToken = Token.load(event.params.baseToken.toHexString());
    let quoteToken = Token.load(event.params.quoteToken.toHexString());

    if (baseToken === null) {
        baseToken = new Token(event.params.baseToken.toHexString());
        baseToken.symbol = fetchTokenSymbol(event.params.baseToken);
        baseToken.name = fetchTokenName(event.params.baseToken);
        baseToken.totalSupply = fetchTokenTotalSupply(event.params.baseToken);

        let decimals = fetchTokenDecimals(event.params.baseToken);
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        baseToken.decimals = decimals
        baseToken.tradeVolume = ZERO_BD
        baseToken.tradeVolumeUSD = ZERO_BD
        baseToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        baseToken.txCount = ZERO_BI

    }

    if (quoteToken === null) {
        quoteToken = new Token(event.params.quoteToken.toHexString());
        quoteToken.symbol = fetchTokenSymbol(event.params.quoteToken);
        quoteToken.name = fetchTokenName(event.params.quoteToken);
        quoteToken.totalSupply = fetchTokenTotalSupply(event.params.quoteToken);

        let decimals = fetchTokenDecimals(event.params.quoteToken);
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        quoteToken.decimals = decimals
        quoteToken.tradeVolume = ZERO_BD
        quoteToken.tradeVolumeUSD = ZERO_BD
        quoteToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        quoteToken.txCount = ZERO_BI
    }

    let pair = new Pair(event.params.newBorn.toHexString()) as Pair

    pair.quoteToken = event.params.quoteToken.toHexString();
    pair.baseToken = event.params.baseToken.toHexString();
    pair.createdAtBlockNumber = event.block.number;
    pair.createdAtTimestamp = event.block.timestamp;

    pair.txCount = ZERO_BI;
    pair.midPrice = ZERO_BD;
    pair.volumeBaseToken = ZERO_BD;
    pair.volumeQuoteToken = ZERO_BD;
    pair.midPrice = ZERO_BD;
    pair.baseLiquidityProviderCount = ZERO_BI;
    pair.quoteLiquidityProviderCount = ZERO_BI;
    pair.baseLpTokenTotalSupply = ZERO_BD;
    pair.quoteLpTokenTotalSupply = ZERO_BD;
    pair.baseReserve = ZERO_BD;
    pair.quoteReserve = ZERO_BD;
    pair.reserveUSD = ZERO_BD;
    // create the tracked contract based on the template
    // DODOTemplate.create(event.params.newBorn);
    baseToken.save();
    quoteToken.save();
    pair.save();
    dodoZoo.save();

}

export function hardCodePair4Wcres(event: ethereum.Event): void {

    if (event.block.number.toI32() > 11347864 || event.block.number.toI32() < 11327864) {
        return;
    }

    let oldPair = Pair.load("0x85f9569b69083c3e6aeffd301bb2c65606b5d575");
    if (oldPair !== null) {
        return;
    }

    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZoo_ADDRESS);
        dodoZoo.pairCount = 0;
        dodoZoo.totalLiquidityUSD = ZERO_BD;
        dodoZoo.totalVolumeUSD = ZERO_BD;
        dodoZoo.txCount = ZERO_BI;
    }
    dodoZoo.pairCount = dodoZoo.pairCount + 1;
    dodoZoo.save();

    //tokens
    let baseToken = Token.load("0xa0afaa285ce85974c3c881256cb7f225e3a1178a");
    let quoteToken = Token.load("0xdac17f958d2ee523a2206206994597c13d831ec7");

    if (baseToken === null) {
        baseToken = new Token("0xa0afaa285ce85974c3c881256cb7f225e3a1178a");
        baseToken.symbol = fetchTokenSymbol(Address.fromString("0xa0afaa285ce85974c3c881256cb7f225e3a1178a"));
        baseToken.name = fetchTokenName(Address.fromString("0xa0afaa285ce85974c3c881256cb7f225e3a1178a"));
        baseToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0xa0afaa285ce85974c3c881256cb7f225e3a1178a"));

        let decimals = fetchTokenDecimals(Address.fromString("0xa0afaa285ce85974c3c881256cb7f225e3a1178a"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        baseToken.decimals = decimals
        baseToken.tradeVolume = ZERO_BD
        baseToken.tradeVolumeUSD = ZERO_BD
        baseToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        baseToken.txCount = ZERO_BI
        baseToken.priceUsd = ZERO_BD;

    }

    if (quoteToken === null) {
        quoteToken = new Token("0xdac17f958d2ee523a2206206994597c13d831ec7");
        quoteToken.symbol = fetchTokenSymbol(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        quoteToken.name = fetchTokenName(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        quoteToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));

        let decimals = fetchTokenDecimals(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        quoteToken.decimals = decimals
        quoteToken.tradeVolume = ZERO_BD
        quoteToken.tradeVolumeUSD = ZERO_BD
        quoteToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        quoteToken.txCount = ZERO_BI
        quoteToken.priceUsd = ONE_BD;

    }

    let pair = new Pair("0x85f9569b69083c3e6aeffd301bb2c65606b5d575") as Pair

    pair.quoteToken = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    pair.baseToken = "0xa0afaa285ce85974c3c881256cb7f225e3a1178a";
    pair.createdAtBlockNumber = BigInt.fromI32(11337864);
    pair.createdAtTimestamp = BigInt.fromI32(1606444416);

    pair.txCount = ZERO_BI;
    pair.midPrice = ZERO_BD;
    pair.volumeBaseToken = ZERO_BD;
    pair.volumeQuoteToken = ZERO_BD;
    pair.midPrice = ZERO_BD;
    pair.baseLiquidityProviderCount = ZERO_BI;
    pair.quoteLiquidityProviderCount = ZERO_BI;
    pair.baseLpTokenTotalSupply = ZERO_BD;
    pair.quoteLpTokenTotalSupply = ZERO_BD;
    pair.baseReserve = ZERO_BD;
    pair.quoteReserve = ZERO_BD;
    pair.reserveUSD = ZERO_BD;
    // create the tracked contract based on the template
    // DODOTemplate.create(Address.fromString("0x85f9569b69083c3e6aeffd301bb2c65606b5d575"));
    baseToken.save();
    quoteToken.save();
    pair.save();
    dodoZoo.save();
}

export function hardCodePair4AAVE(event: ethereum.Event): void {

    if (event.block.number.toI32() > 11234029 || event.block.number.toI32() < 11214029) {
        return;
    }

    let oldPair = Pair.load("0x94512fd4fb4feb63a6c0f4bedecc4a00ee260528");
    if (oldPair !== null) {
        return;
    }

    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZoo_ADDRESS);
        dodoZoo.pairCount = 0;
        dodoZoo.totalLiquidityUSD = ZERO_BD;
        dodoZoo.totalVolumeUSD = ZERO_BD;
        dodoZoo.txCount = ZERO_BI;
    }
    dodoZoo.pairCount = dodoZoo.pairCount + 1;
    dodoZoo.save();

    //tokens
    let baseToken = Token.load("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9");
    let quoteToken = Token.load("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

    if (baseToken === null) {
        baseToken = new Token("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9");
        baseToken.symbol = fetchTokenSymbol(Address.fromString("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"));
        baseToken.name = fetchTokenName(Address.fromString("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"));
        baseToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"));

        let decimals = fetchTokenDecimals(Address.fromString("0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        baseToken.decimals = decimals
        baseToken.tradeVolume = ZERO_BD
        baseToken.tradeVolumeUSD = ZERO_BD
        baseToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        baseToken.txCount = ZERO_BI
        baseToken.priceUsd = ZERO_BD;

    }

    if (quoteToken === null) {
        quoteToken = new Token("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
        quoteToken.symbol = fetchTokenSymbol(Address.fromString("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"));
        quoteToken.name = fetchTokenName(Address.fromString("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"));
        quoteToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"));

        let decimals = fetchTokenDecimals(Address.fromString("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        quoteToken.decimals = decimals
        quoteToken.tradeVolume = ZERO_BD
        quoteToken.tradeVolumeUSD = ZERO_BD
        quoteToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        quoteToken.txCount = ZERO_BI
        quoteToken.priceUsd = ONE_BD;

    }

    let pair = new Pair("0x94512fd4fb4feb63a6c0f4bedecc4a00ee260528") as Pair

    pair.quoteToken = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    pair.baseToken = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
    pair.createdAtBlockNumber = BigInt.fromI32(11224029);
    pair.createdAtTimestamp = BigInt.fromI32(1604934756);

    pair.txCount = ZERO_BI;
    pair.midPrice = ZERO_BD;
    pair.volumeBaseToken = ZERO_BD;
    pair.volumeQuoteToken = ZERO_BD;
    pair.midPrice = ZERO_BD;
    pair.baseLiquidityProviderCount = ZERO_BI;
    pair.quoteLiquidityProviderCount = ZERO_BI;
    pair.baseLpTokenTotalSupply = ZERO_BD;
    pair.quoteLpTokenTotalSupply = ZERO_BD;
    pair.baseReserve = ZERO_BD;
    pair.quoteReserve = ZERO_BD;
    pair.reserveUSD = ZERO_BD;
    // create the tracked contract based on the template
    // DODOTemplate.create(Address.fromString("0x85f9569b69083c3e6aeffd301bb2c65606b5d575"));
    baseToken.save();
    quoteToken.save();
    pair.save();
    dodoZoo.save();
}

export function hardCodePair4FIN(event: ethereum.Event): void {

    if (event.block.number.toI32() > 11034792 || event.block.number.toI32() < 11014792) {
        return;
    }

    let oldPair = Pair.load("0x9d9793e1e18cdee6cf63818315d55244f73ec006");
    if (oldPair !== null) {
        return;
    }

    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    if (dodoZoo === null) {
        dodoZoo = new DodoZoo(DODOZoo_ADDRESS);
        dodoZoo.pairCount = 0;
        dodoZoo.totalLiquidityUSD = ZERO_BD;
        dodoZoo.totalVolumeUSD = ZERO_BD;
        dodoZoo.txCount = ZERO_BI;
    }
    dodoZoo.pairCount = dodoZoo.pairCount + 1;
    dodoZoo.save();

    //tokens
    let baseToken = Token.load("0x054f76beed60ab6dbeb23502178c52d6c5debe40");
    let quoteToken = Token.load("0xdac17f958d2ee523a2206206994597c13d831ec7");

    if (baseToken === null) {
        baseToken = new Token("0x054f76beed60ab6dbeb23502178c52d6c5debe40");
        baseToken.symbol = fetchTokenSymbol(Address.fromString("0x054f76beed60ab6dbeb23502178c52d6c5debe40"));
        baseToken.name = fetchTokenName(Address.fromString("0x054f76beed60ab6dbeb23502178c52d6c5debe40"));
        baseToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0x054f76beed60ab6dbeb23502178c52d6c5debe40"));

        let decimals = fetchTokenDecimals(Address.fromString("0x054f76beed60ab6dbeb23502178c52d6c5debe40"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        baseToken.decimals = decimals
        baseToken.tradeVolume = ZERO_BD
        baseToken.tradeVolumeUSD = ZERO_BD
        baseToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        baseToken.txCount = ZERO_BI
        baseToken.priceUsd = ZERO_BD;

    }

    if (quoteToken === null) {
        quoteToken = new Token("0xdac17f958d2ee523a2206206994597c13d831ec7");
        quoteToken.symbol = fetchTokenSymbol(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        quoteToken.name = fetchTokenName(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        quoteToken.totalSupply = fetchTokenTotalSupply(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));

        let decimals = fetchTokenDecimals(Address.fromString("0xdac17f958d2ee523a2206206994597c13d831ec7"));
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
            return
        }

        quoteToken.decimals = decimals
        quoteToken.tradeVolume = ZERO_BD
        quoteToken.tradeVolumeUSD = ZERO_BD
        quoteToken.totalLiquidity = ZERO_BD
        // token0.allPairs = []
        quoteToken.txCount = ZERO_BI
        quoteToken.priceUsd = ONE_BD;

    }

    let pair = new Pair("0x9d9793e1e18cdee6cf63818315d55244f73ec006") as Pair

    pair.quoteToken = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    pair.baseToken = "0x054f76beed60ab6dbeb23502178c52d6c5debe40";
    pair.createdAtBlockNumber = BigInt.fromI32(11024792);
    pair.createdAtTimestamp = BigInt.fromI32(1602294120);

    pair.txCount = ZERO_BI;
    pair.midPrice = ZERO_BD;
    pair.volumeBaseToken = ZERO_BD;
    pair.volumeQuoteToken = ZERO_BD;
    pair.midPrice = ZERO_BD;
    pair.baseLiquidityProviderCount = ZERO_BI;
    pair.quoteLiquidityProviderCount = ZERO_BI;
    pair.baseLpTokenTotalSupply = ZERO_BD;
    pair.quoteLpTokenTotalSupply = ZERO_BD;
    pair.baseReserve = ZERO_BD;
    pair.quoteReserve = ZERO_BD;
    pair.reserveUSD = ZERO_BD;
    // create the tracked contract based on the template
    // DODOTemplate.create(Address.fromString("0x85f9569b69083c3e6aeffd301bb2c65606b5d575"));
    baseToken.save();
    quoteToken.save();
    pair.save();
    dodoZoo.save();
}
