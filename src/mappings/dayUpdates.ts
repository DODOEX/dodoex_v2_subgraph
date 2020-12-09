import {Pair, Bundle, Token, DodoZoo, DodoDayData, PairDayData, TokenDayData, PairHourData} from '../types/schema'
import {BigInt, BigDecimal, ethereum,log} from '@graphprotocol/graph-ts'
import {ONE_BI, ONE_BD, ZERO_BI, ZERO_BD, DODOZoo_ADDRESS,dealPriceDecimals} from './helpers'
import {DODO as DODOContract} from "../types/templates/DODO/DODO"

export function updateDodoDayData(event: ethereum.Event): DodoDayData {
    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;
    let dodoDayData = DodoDayData.load(dayID.toString());
    if (dodoDayData == null) {
        dodoDayData = new DodoDayData(dayID.toString());
        dodoDayData.date = dayStartTimestamp;
        dodoDayData.dailyVolumeUSD = ZERO_BD;
        dodoDayData.totalVolumeUSD = ZERO_BD;
        dodoDayData.totalLiquidityUSD = ZERO_BD;
        dodoDayData.txCount = ZERO_BI;
    }

    dodoDayData.totalLiquidityUSD = dodoZoo.totalLiquidityUSD;
    dodoDayData.txCount = dodoDayData.txCount.plus(ONE_BI);
    dodoDayData.save();

    return dodoDayData as DodoDayData;

}

export function updatePairDayData(event: ethereum.Event): PairDayData {
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;

    let dayPairID = event.address.toHexString().concat("-").concat(BigInt.fromI32(dayID).toString());

    let pair = Pair.load(event.address.toHexString());
    let pairDayData = PairDayData.load(dayPairID);
    if (pairDayData === null) {
        pairDayData = new PairDayData(dayPairID);
        pairDayData.date = dayStartTimestamp;
        pairDayData.baseToken = pair.baseToken;
        pairDayData.quoteToken = pair.quoteToken;
        pairDayData.pairAddress = event.address;
        pairDayData.dailyTxns = ZERO_BI;
        pairDayData.dailyVolumeBase = ZERO_BD;
        pairDayData.dailyVolumeQuote = ZERO_BD;
        pairDayData.dailyVolumeUSD = ZERO_BD;
    }

    pairDayData.baseLpTokenTotalSupply = pair.baseLpTokenTotalSupply;
    pairDayData.quoteLpTokenTotalSupply = pair.quoteLpTokenTotalSupply;

    pairDayData.baseTokenReserve = pair.baseReserve;
    pairDayData.quoteTokenReserve = pair.quoteReserve;

    pairDayData.reserveUSD = pair.reserveUSD;
    pairDayData.dailyTxns = pairDayData.dailyTxns.plus(ONE_BI);
    pairDayData.save();

    return pairDayData as PairDayData;

}

export function updatePairHourData(event: ethereum.Event): PairHourData {

    let timestamp = event.block.timestamp.toI32();
    let hourIndex = timestamp / 3600;
    let hourStartUnix = hourIndex * 3600
    let hourPairID = event.address.toHexString().concat("-").concat(BigInt.fromI32(hourIndex).toString());

    let pair = Pair.load(event.address.toHexString());

    //current price from midprice
    let dodo = DODOContract.bind(event.address);

    let price:BigDecimal ;
    if(pair.volumeBaseToken.equals(BigDecimal.fromString("0"))){
        price= BigDecimal.fromString("0");
    }else{
        let midPrice = dodo.getMidPrice();
        price= dealPriceDecimals(pair.baseToken.toString(),BigDecimal.fromString(midPrice.toString()));
    }

    let pairHourData = PairHourData.load(hourPairID);
    if (pairHourData === null) {
        pairHourData = new PairHourData(hourPairID);
        pairHourData.hourStartUnix = hourStartUnix;
        pairHourData.pair = event.address.toHexString();
        pairHourData.hourlyVolumeBase = ZERO_BD;
        pairHourData.hourlyVolumeQuote = ZERO_BD;
        pairHourData.hourlyVolumeUSD = ZERO_BD;
        pairHourData.hourlyTxns = ZERO_BI;
        pairHourData.openPrice = price;
        pairHourData.higherPrice = price;
        pairHourData.lowerPrice = price;
        pairHourData.closePrice = price;
    }

    pairHourData.baseTokenReserve = pair.baseReserve;
    pairHourData.quoteTokenReserve = pair.quoteReserve;
    pairHourData.reserveUSD = pair.reserveUSD;
    pairHourData.hourlyTxns = pairHourData.hourlyTxns.plus(ONE_BI);
    pairHourData.save();

    //deal price
    pairHourData.closePrice = price;
    if(price.gt(pairHourData.higherPrice)){
        pairHourData.higherPrice = price
    }
    if(price.lt(pairHourData.lowerPrice)){
        pairHourData.lowerPrice = price
    }

    return pairHourData as PairHourData;

}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
    let bundle = Bundle.load("1");
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;
    let tokenDayID = token.id.toString().concat("-").concat(BigInt.fromI32(dayID).toString());

    let tokenDayData = TokenDayData.load(tokenDayID);
    if (tokenDayData === null) {
        tokenDayData = new TokenDayData(tokenDayID);
        tokenDayData.date = dayStartTimestamp;
        tokenDayData.token = token.id;
        tokenDayData.priceUSD = token.priceUsd;
        tokenDayData.dailyVolumeToken = ZERO_BD;
        tokenDayData.dailyVolumeUSD = ZERO_BD;
        tokenDayData.dailyTxns = ZERO_BI;
        tokenDayData.totalLiquidityUSD = ZERO_BD;
    }

    tokenDayData.priceUSD = token.priceUsd;
    tokenDayData.totalLiquidityToken = token.totalLiquidity;
    tokenDayData.totalLiquidityUSD = token.totalLiquidity.times(token.priceUsd);
    tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
    tokenDayData.save();

    return tokenDayData as TokenDayData

}
