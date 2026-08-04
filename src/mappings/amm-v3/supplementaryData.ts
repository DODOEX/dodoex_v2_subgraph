import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  LpToken,
  Pair,
  PairDayData,
  PairHourData,
  Pool,
  PoolDayData,
  PoolHourData,
  Token,
  User,
} from "../../types/amm-v3/schema";
import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "./utils/token";
import { ADDRESS_ZERO, BI_18, ZERO_BD, ZERO_BI } from "../constant";

export function createPair(pool: Pool): Pair {
  let id = pool.id;
  let pair = Pair.load(id);
  if (pair == null) {
    pair = new Pair(id);
    pair.type = "AMMV3";
    pair.creator = pool.creator;
    pair.owner = pool.creator;
    pair.baseToken = pool.token0;
    pair.quoteToken = pool.token1;
    let baseToken = Token.load(pool.token0);
    if (baseToken != null) pair.baseSymbol = baseToken.symbol;
    let quoteToken = Token.load(pool.token1);
    if (quoteToken != null) pair.quoteSymbol = quoteToken.symbol;
    pair.i = ZERO_BI;
    pair.k = ZERO_BI;
    pair.lpFeeRate = ZERO_BD;
    pair.untrackedBaseVolume = ZERO_BD;
    pair.untrackedQuoteVolume = ZERO_BD;
    pair.untrackedVolumeUSD = ZERO_BD;
    pair.createdAtTimestamp = pool.createdAtTimestamp;
    pair.createdAtBlockNumber = pool.createdAtBlockNumber;
    pair.liquidityProviderCount = pool.liquidityProviderCount;
    pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
    pair.maintainer = Address.fromString(ADDRESS_ZERO);
    pair.mtFeeRate = ZERO_BI;
    pair.mtFeeBase = ZERO_BD;
    pair.mtFeeQuote = ZERO_BD;
    pair.mtFeeUSD = ZERO_BD;
    pair.lastTradePrice = ZERO_BD;
    pair.isTradeAllowed = true;
    pair.isDepositBaseAllowed = true;
    pair.isDepositQuoteAllowed = true;
  }
  let baseLpToken = createLpToken(Address.fromString(pool.id), pair, false);
  baseLpToken.updatedAt = pool.updatedAt;
  baseLpToken.save();
  baseLpToken.updatedAt = pool.updatedAt;
  baseLpToken.save();
  pair.baseLpToken = baseLpToken.id;
  pair.quoteLpToken = baseLpToken.id;
  pair.baseReserve = pool.totalValueLockedToken0;
  pair.quoteReserve = pool.totalValueLockedToken1;
  //   pair.lastTradePrice = pool.token1Price.div(pool.token0Price);
  pair.volumeBaseToken = pool.volumeToken0;
  pair.volumeQuoteToken = pool.volumeToken1;
  pair.volumeUSD = pool.volumeUSD;
  pair.feeBase = pool.collectedFeesToken0;
  pair.feeQuote = pool.collectedFeesToken1;
  pair.feeUSD = pool.feesUSD;
  pair.txCount = pool.txCount;
  pair.traderCount = ZERO_BI;
  pair.lpFeeRate = pool.feeTier.toBigDecimal();

  pair.updatedAt = pool.updatedAt;
  pair.save();

  return pair as Pair;
}

export function createLpToken(
  address: Address,
  pair: Pair,
  isUpdateTotalSupply: boolean = true
): LpToken {
  let lpToken = LpToken.load(address.toHexString());
  let decimals = fetchTokenDecimals(address, []);

  if (lpToken == null) {
    lpToken = new LpToken(address.toHexString());
    lpToken.decimals = decimals;
    lpToken.name = fetchTokenName(address, []);
    lpToken.symbol = fetchTokenSymbol(address, []);
    lpToken.totalSupply = ZERO_BI;
    lpToken.pair = pair.id;
  }

  //for V1 classical hardcode pools
  if (lpToken.symbol == "unknown") {
    lpToken.symbol = fetchTokenSymbol(address, []);
    lpToken.name = fetchTokenName(address, []);
    lpToken.decimals = decimals;
  }

  if (isUpdateTotalSupply || lpToken.symbol == "unknown") {
    lpToken.totalSupply = fetchTokenTotalSupply(address);
  }
  lpToken.save();
  return lpToken as LpToken;
}

export function updatePairDayData(poolDayData: PoolDayData): PairDayData {
  let dayPoolID = poolDayData.id;
  let pairDayData = PairDayData.load(dayPoolID);
  let pool = Pool.load(poolDayData.pool);
  if (pairDayData === null) {
    pairDayData = new PairDayData(dayPoolID);
    pairDayData.date = poolDayData.date;
    pairDayData.pairAddress = Address.fromString(poolDayData.pool);
    pairDayData.pair = poolDayData.pool;
    if (pool !== null) {
      pairDayData.baseToken = pool.token0;
      pairDayData.quoteToken = pool.token1;
    }
    pairDayData.baseLpTokenTotalSupply = ZERO_BD;
    pairDayData.quoteLpTokenTotalSupply = ZERO_BD;
    pairDayData.untrackedBaseVolume = ZERO_BD;
    pairDayData.untrackedQuoteVolume = ZERO_BD;
    pairDayData.traders = ZERO_BI;
    pairDayData.feeBase = ZERO_BD;
    pairDayData.feeQuote = ZERO_BD;
  }
  if (pool !== null) {
    pairDayData.baseTokenReserve = pool.totalValueLockedToken0;
    pairDayData.quoteTokenReserve = pool.totalValueLockedToken1;
    pairDayData.lpFeeRate = pool.feeTier.toBigDecimal();
  }
  pairDayData.baseUsdPrice = poolDayData.token0Price;
  pairDayData.quoteUsdPrice = poolDayData.token1Price;
  pairDayData.volumeBase = poolDayData.volumeToken0;
  pairDayData.volumeQuote = poolDayData.volumeToken1;
  pairDayData.feeBase = poolDayData.volumeToken0
    .times(pairDayData.lpFeeRate)
    .div(BigDecimal.fromString("1000000"));
  pairDayData.feeQuote = poolDayData.volumeToken1
    .times(pairDayData.lpFeeRate)
    .div(BigDecimal.fromString("1000000"));
  pairDayData.volumeUSD = poolDayData.volumeUSD;
  pairDayData.txns = poolDayData.txCount;

  pairDayData.updatedAt = poolDayData.updatedAt;
  pairDayData.save();

  return pairDayData as PairDayData;
}

export function updatePairHourData(poolHourData: PoolHourData): PairHourData {
  let hourPoolID = poolHourData.id;
  let pairHourData = PairHourData.load(hourPoolID);
  let pool = Pool.load(poolHourData.pool);
  if (pairHourData === null) {
    pairHourData = new PairHourData(hourPoolID);
    pairHourData.hour = poolHourData.periodStartUnix;
    pairHourData.pairAddress = Address.fromString(poolHourData.pool);
    pairHourData.pair = poolHourData.pool;
    if (pool !== null) {
      pairHourData.baseToken = pool.token0;
      pairHourData.quoteToken = pool.token1;
    }
    pairHourData.baseLpTokenTotalSupply = ZERO_BD;
    pairHourData.quoteLpTokenTotalSupply = ZERO_BD;
    pairHourData.untrackedBaseVolume = ZERO_BD;
    pairHourData.untrackedQuoteVolume = ZERO_BD;
    pairHourData.traders = ZERO_BI;
    pairHourData.feeBase = ZERO_BD;
    pairHourData.feeQuote = ZERO_BD;
  }
  if (pool !== null) {
    pairHourData.baseTokenReserve = pool.totalValueLockedToken0;
    pairHourData.quoteTokenReserve = pool.totalValueLockedToken1;
    pairHourData.lpFeeRate = pool.feeTier.toBigDecimal();
  }
  pairHourData.baseUsdPrice = poolHourData.token0Price;
  pairHourData.quoteUsdPrice = poolHourData.token1Price;
  pairHourData.volumeBase = poolHourData.volumeToken0;
  pairHourData.volumeQuote = poolHourData.volumeToken1;
  pairHourData.volumeUSD = poolHourData.volumeUSD;
  pairHourData.feeBase = poolHourData.volumeToken0
    .times(pairHourData.lpFeeRate)
    .div(BigDecimal.fromString("1000000"));
  pairHourData.feeQuote = poolHourData.volumeToken1
    .times(pairHourData.lpFeeRate)
    .div(BigDecimal.fromString("1000000"));
  pairHourData.txns = poolHourData.txCount;

  pairHourData.updatedAt = poolHourData.updatedAt;
  pairHourData.save();

  return pairHourData as PairHourData;
}

export function createUser(address: Address, timestamp: BigInt): User {
  let user = User.load(address.toHexString());
  if (user === null) {
    user = new User(address.toHexString());
    user.usdSwapped = ZERO_BD;
    user.txCount = ZERO_BI;
    user.tradingRewardRecieved = ZERO_BD;
    user.timestamp = timestamp;
  }
  user.updatedAt = timestamp;
  user.save();
  return user as User;
}
