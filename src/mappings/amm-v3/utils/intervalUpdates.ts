import { ethereum } from "@graphprotocol/graph-ts";

import {
  Bundle,
  AMMFactory,
  Pool,
  PoolDayData,
  PoolHourData,
  Token,
  TokenDayData,
  TokenHourData,
  AMMDayData,
} from "../../../types/amm-v3/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "../../constant";

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export function updateAMMDayData(
  event: ethereum.Event,
  factoryAddress: string
): AMMDayData {
  const amm = AMMFactory.load(factoryAddress)!;
  const timestamp = event.block.timestamp.toI32();
  const dayID = timestamp / 86400; // rounded
  const dayStartTimestamp = dayID * 86400;
  let ammDayData = AMMDayData.load(dayID.toString());
  if (ammDayData === null) {
    ammDayData = new AMMDayData(dayID.toString());
    ammDayData.date = dayStartTimestamp;
    ammDayData.volumeETH = ZERO_BD;
    ammDayData.volumeUSD = ZERO_BD;
    ammDayData.volumeUSDUntracked = ZERO_BD;
    ammDayData.feesUSD = ZERO_BD;
  }
  ammDayData.tvlUSD = amm.totalValueLockedUSD;
  ammDayData.txCount = amm.txCount;
  ammDayData.updatedAt = event.block.timestamp;
  ammDayData.save();
  return ammDayData as AMMDayData;
}

export function updatePoolDayData(event: ethereum.Event): PoolDayData {
  const timestamp = event.block.timestamp.toI32();
  const dayID = timestamp / 86400;
  const dayStartTimestamp = dayID * 86400;
  const dayPoolID = event.address
    .toHexString()
    .concat("-")
    .concat(dayID.toString());
  const pool = Pool.load(event.address.toHexString())!;
  let poolDayData = PoolDayData.load(dayPoolID);
  if (poolDayData === null) {
    poolDayData = new PoolDayData(dayPoolID);
    poolDayData.date = dayStartTimestamp;
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.open = pool.token0Price;
    poolDayData.high = pool.token0Price;
    poolDayData.low = pool.token0Price;
    poolDayData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolDayData.high)) {
    poolDayData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low)) {
    poolDayData.low = pool.token0Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.close = pool.token0Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.save();

  return poolDayData as PoolDayData;
}

export function updatePoolHourData(event: ethereum.Event): PoolHourData {
  const timestamp = event.block.timestamp.toI32();
  const hourIndex = timestamp / 3600; // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600; // want the rounded effect
  const hourPoolID = event.address
    .toHexString()
    .concat("-")
    .concat(hourIndex.toString());
  const pool = Pool.load(event.address.toHexString())!;
  let poolHourData = PoolHourData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.open = pool.token0Price;
    poolHourData.high = pool.token0Price;
    poolHourData.low = pool.token0Price;
    poolHourData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.close = pool.token0Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolHourData;
}

export function updateTokenDayData(
  token: Token,
  event: ethereum.Event
): TokenDayData {
  const bundle = Bundle.load("1")!;
  const timestamp = event.block.timestamp.toI32();
  const dayID = timestamp / 86400;
  const dayStartTimestamp = dayID * 86400;
  const tokenDayID = token.id.toString().concat("-").concat(dayID.toString());
  const tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  let tokenDayData = TokenDayData.load(tokenDayID);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID);
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    tokenDayData.volume = ZERO_BD;
    tokenDayData.volumeUSD = ZERO_BD;
    tokenDayData.feesUSD = ZERO_BD;
    tokenDayData.untrackedVolumeUSD = ZERO_BD;
    tokenDayData.open = tokenPrice;
    tokenDayData.high = tokenPrice;
    tokenDayData.low = tokenPrice;
    tokenDayData.close = tokenPrice;
    tokenDayData.txns = ZERO_BI;
    tokenDayData.untrackedVolume = ZERO_BD;
    tokenDayData.volume = ZERO_BD;
    tokenDayData.volumeBridge = ZERO_BD;
    tokenDayData.volumeUSD = ZERO_BD;
    tokenDayData.traders = ZERO_BI;
    tokenDayData.fee = ZERO_BD;
    tokenDayData.maintainerFee = ZERO_BD;
    tokenDayData.maintainerFeeUSD = ZERO_BD;
    tokenDayData.usdPrice = ZERO_BD;
    tokenDayData.totalLiquidityToken = ZERO_BD;
  }

  if (tokenPrice.gt(tokenDayData.high)) {
    tokenDayData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenDayData.low)) {
    tokenDayData.low = tokenPrice;
  }

  tokenDayData.close = tokenPrice;
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPriceUSD);
  tokenDayData.totalValueLocked = token.totalValueLocked;
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenDayData.updatedAt = event.block.timestamp;
  tokenDayData.save();

  return tokenDayData as TokenDayData;
}

export function updateTokenHourData(
  token: Token,
  event: ethereum.Event
): TokenHourData {
  const bundle = Bundle.load("1")!;
  const timestamp = event.block.timestamp.toI32();
  const hourIndex = timestamp / 3600; // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600; // want the rounded effect
  const tokenHourID = token.id
    .toString()
    .concat("-")
    .concat(hourIndex.toString());
  let tokenHourData = TokenHourData.load(tokenHourID);
  const tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(tokenHourID);
    tokenHourData.periodStartUnix = hourStartUnix;
    tokenHourData.token = token.id;
    tokenHourData.volume = ZERO_BD;
    tokenHourData.volumeUSD = ZERO_BD;
    tokenHourData.untrackedVolumeUSD = ZERO_BD;
    tokenHourData.feesUSD = ZERO_BD;
    tokenHourData.open = tokenPrice;
    tokenHourData.high = tokenPrice;
    tokenHourData.low = tokenPrice;
    tokenHourData.close = tokenPrice;
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice;
  }

  tokenHourData.close = tokenPrice;
  tokenHourData.priceUSD = tokenPrice;
  tokenHourData.totalValueLocked = token.totalValueLocked;
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenHourData.save();

  return tokenHourData as TokenHourData;
}
