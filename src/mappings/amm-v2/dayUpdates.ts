/* eslint-disable prefer-const */
import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";

import {
  Bundle,
  Pair,
  PairDayData,
  Token,
  TokenDayData,
  AMMDayData,
  AMMFactory,
} from "../../types/amm-v2/schema";
import { PairHourData } from "../../types/amm-v2/schema";
import { FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from "../constant";

export function updateAMMDayData(event: ethereum.Event): AMMDayData {
  let amm = AMMFactory.load(FACTORY_ADDRESS)!;
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let ammDayData = AMMDayData.load(dayID.toString());
  if (ammDayData === null) {
    ammDayData = new AMMDayData(dayID.toString());
    ammDayData.date = dayStartTimestamp;
    ammDayData.dailyVolumeUSD = ZERO_BD;
    ammDayData.dailyVolumeETH = ZERO_BD;
    ammDayData.totalVolumeUSD = ZERO_BD;
    ammDayData.totalVolumeETH = ZERO_BD;
    ammDayData.dailyVolumeUntracked = ZERO_BD;
    ammDayData.txCount = ZERO_BI;
    ammDayData.uniqueUsersCount = ZERO_BI;
    ammDayData.volumeUSD = ZERO_BD;
    ammDayData.feeUSD = ZERO_BD;
    ammDayData.maintainerFeeUSD = ZERO_BD;
  }

  ammDayData.totalLiquidityUSD = amm.totalLiquidityUSD;
  ammDayData.totalLiquidityETH = amm.totalLiquidityETH;
  ammDayData.txCount = amm.txCount;
  ammDayData.updatedAt = event.block.timestamp;
  ammDayData.save();

  return ammDayData as AMMDayData;
}

export function updatePairDayData(event: ethereum.Event): PairDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let dayPairID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());
  let pair = Pair.load(event.address.toHexString())!;
  let pairDayData = PairDayData.load(dayPairID);
  if (pairDayData === null) {
    pairDayData = new PairDayData(dayPairID);
    pairDayData.date = dayStartTimestamp;
    pairDayData.baseToken = pair.baseToken;
    pairDayData.quoteToken = pair.quoteToken;
    pairDayData.pairAddress = event.address;
    pairDayData.volumeBase = ZERO_BD;
    pairDayData.volumeQuote = ZERO_BD;
    pairDayData.volumeUSD = ZERO_BD;
    pairDayData.txns = ZERO_BI;
  }

  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.baseTokenReserve = pair.baseReserve;
  pairDayData.quoteTokenReserve = pair.quoteReserve;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.txns = pairDayData.txns.plus(ONE_BI);
  pairDayData.updatedAt = event.block.timestamp;
  pairDayData.save();

  return pairDayData as PairDayData;
}

export function updatePairHourData(event: ethereum.Event): PairHourData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let hourPairID = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(hourIndex).toString());
  let pair = Pair.load(event.address.toHexString())!;
  let pairHourData = PairHourData.load(hourPairID);
  if (pairHourData === null) {
    pairHourData = new PairHourData(hourPairID);
    pairHourData.hour = hourStartUnix;
    pairHourData.pair = event.address.toHexString();
    pairHourData.volumeBase = ZERO_BD;
    pairHourData.volumeQuote = ZERO_BD;
    pairHourData.volumeUSD = ZERO_BD;
    pairHourData.txns = ZERO_BI;
  }

  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.baseTokenReserve = pair.baseReserve;
  pairHourData.quoteTokenReserve = pair.quoteReserve;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.txns = pairHourData.txns.plus(ONE_BI);
  pairHourData.updatedAt = event.block.timestamp;
  pairHourData.save();

  return pairHourData as PairHourData;
}

export function updateTokenDayData(
  token: Token,
  event: ethereum.Event
): TokenDayData {
  let bundle = Bundle.load("1")!;
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let tokenDayID = token.id
    .toString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());

  let tokenDayData = TokenDayData.load(tokenDayID);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID);
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    tokenDayData.usdPrice = token.derivedETH.times(bundle.ethPrice);
    tokenDayData.dailyVolumeToken = ZERO_BD;
    tokenDayData.dailyVolumeETH = ZERO_BD;
    tokenDayData.dailyVolumeUSD = ZERO_BD;
    tokenDayData.txns = ZERO_BI;
    tokenDayData.totalLiquidityUSD = ZERO_BD;
  }
  tokenDayData.usdPrice = token.derivedETH.times(bundle.ethPrice);
  tokenDayData.totalLiquidityToken = token.totalLiquidity;
  tokenDayData.totalLiquidityETH = token.totalLiquidity.times(
    token.derivedETH as BigDecimal
  );
  tokenDayData.totalLiquidityUSD = tokenDayData.totalLiquidityETH.times(
    bundle.ethPrice
  );
  tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
  tokenDayData.updatedAt = event.block.timestamp;
  tokenDayData.save();

  /**
   * @todo test if this speeds up sync
   */
  // updateStoredTokens(tokenDayData as TokenDayData, dayID)
  // updateStoredPairs(tokenDayData as TokenDayData, dayPairID)

  return tokenDayData as TokenDayData;
}
