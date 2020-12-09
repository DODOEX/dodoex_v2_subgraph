/* eslint-disable prefer-const */

import {log} from '@graphprotocol/graph-ts'
import {
    DODOZoo_BATCH_ADDRESS,
    DODOZoo_ADDRESS,
    ZERO_BD,
    ZERO_BI,
    fetchTokenSymbol,
    fetchTokenName,
    fetchTokenDecimals,
    fetchTokenTotalSupply
} from './helpers'
import {DODOBirth} from '../types/DodoZoo/DodoZoo'
import {DodoZoo, Token, Pair} from '../types/schema'
import {DODO as DODOTemplate} from '../types/templates';

export function handleDODOBirth(event: DODOBirth): void {
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
    DODOTemplate.create(event.params.newBorn);
    baseToken.save();
    quoteToken.save();
    pair.save();
    dodoZoo.save();

}
