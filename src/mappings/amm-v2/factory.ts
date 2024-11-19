/* eslint-disable prefer-const */
import { Address, log, BigInt } from "@graphprotocol/graph-ts";

import { PairCreated } from "../../types/amm-v2/Factory/Factory";
import { Bundle, Pair, Token, AMMFactory } from "../../types/amm-v2/schema";
import { Pair as PairTemplate } from "../../types/amm-v2/templates";
import {
  convertTokenToDecimal,
  createLpToken,
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
} from "./helpers";
import {
  ADDRESS_ZERO,
  BI_18,
  FACTORY_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from "../constant";

export function handleNewPair(event: PairCreated): void {
  // load factory (create if first exchange)
  let factory = AMMFactory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new AMMFactory(FACTORY_ADDRESS);
    factory.pairCount = 0;
    factory.totalVolumeETH = ZERO_BD;
    factory.totalLiquidityETH = ZERO_BD;
    factory.totalVolumeUSD = ZERO_BD;
    factory.untrackedVolumeUSD = ZERO_BD;
    factory.totalLiquidityUSD = ZERO_BD;
    factory.txCount = ZERO_BI;
    factory.updatedAt = event.block.timestamp;

    // create new bundle
    let bundle = new Bundle("1");
    bundle.ethPrice = ZERO_BD;
    bundle.updatedAt = event.block.timestamp;
    bundle.save();
  }
  factory.pairCount = factory.pairCount + 1;
  factory.updatedAt = event.block.timestamp;
  factory.save();

  // create the tokens
  let baseToken = Token.load(event.params.token0.toHexString());
  let quoteToken = Token.load(event.params.token1.toHexString());

  // fetch info if null
  if (baseToken === null) {
    baseToken = new Token(event.params.token0.toHexString());
    baseToken.symbol = fetchTokenSymbol(event.params.token0);
    baseToken.name = fetchTokenName(event.params.token0);
    baseToken.totalSupply = fetchTokenTotalSupply(event.params.token0);
    let decimals = fetchTokenDecimals(event.params.token0);

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug("mybug the decimal on token 0 was null", []);
      return;
    }

    baseToken.decimals = decimals;
    baseToken.derivedETH = ZERO_BD;
    baseToken.tradeVolume = ZERO_BD;
    baseToken.tradeVolumeUSD = ZERO_BD;
    baseToken.untrackedVolumeUSD = ZERO_BD;
    baseToken.totalLiquidity = ZERO_BD;
    // token0.allPairs = []
    baseToken.timestamp = event.block.timestamp;
    baseToken.txCount = ZERO_BI;
    baseToken.untrackedVolume = ZERO_BD;
    baseToken.tradeVolume = ZERO_BD;
    baseToken.tradeVolumeBridge = ZERO_BD;
    baseToken.volumeUSD = ZERO_BD;
    baseToken.volumeUSDBridge = ZERO_BD;
    baseToken.traderCount = ZERO_BI;
    baseToken.totalLiquidityOnDODO = ZERO_BD;
    baseToken.usdPrice = ZERO_BD;
    baseToken.priceUpdateTimestamp = ZERO_BI;
  }

  // fetch info if null
  if (quoteToken === null) {
    quoteToken = new Token(event.params.token1.toHexString());
    quoteToken.symbol = fetchTokenSymbol(event.params.token1);
    quoteToken.name = fetchTokenName(event.params.token1);
    quoteToken.totalSupply = fetchTokenTotalSupply(event.params.token1);
    let decimals = fetchTokenDecimals(event.params.token1);

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      return;
    }
    quoteToken.decimals = decimals;
    quoteToken.derivedETH = ZERO_BD;
    quoteToken.tradeVolume = ZERO_BD;
    quoteToken.tradeVolumeUSD = ZERO_BD;
    quoteToken.untrackedVolumeUSD = ZERO_BD;
    quoteToken.totalLiquidity = ZERO_BD;
    // token1.allPairs = []
    quoteToken.timestamp = event.block.timestamp;
    quoteToken.txCount = ZERO_BI;
    quoteToken.untrackedVolume = ZERO_BD;
    quoteToken.tradeVolume = ZERO_BD;
    quoteToken.tradeVolumeBridge = ZERO_BD;
    quoteToken.volumeUSD = ZERO_BD;
    quoteToken.volumeUSDBridge = ZERO_BD;
    quoteToken.traderCount = ZERO_BI;
    quoteToken.totalLiquidityOnDODO = ZERO_BD;
    quoteToken.usdPrice = ZERO_BD;
    quoteToken.priceUpdateTimestamp = ZERO_BI;
  }

  let pair = new Pair(event.params.pair.toHexString()) as Pair;
  pair.baseToken = baseToken.id;
  pair.quoteToken = quoteToken.id;
  pair.liquidityProviderCount = ZERO_BI;
  pair.createdAtTimestamp = event.block.timestamp;
  pair.createdAtBlockNumber = event.block.number;
  pair.txCount = ZERO_BI;
  pair.baseReserve = ZERO_BD;
  pair.quoteReserve = ZERO_BD;
  pair.trackedReserveETH = ZERO_BD;
  pair.reserveETH = ZERO_BD;
  pair.reserveUSD = ZERO_BD;
  pair.totalSupply = ZERO_BD;
  pair.volumeBaseToken = ZERO_BD;
  pair.volumeQuoteToken = ZERO_BD;
  pair.volumeUSD = ZERO_BD;
  pair.untrackedBaseVolume = ZERO_BD;
  pair.untrackedQuoteVolume = ZERO_BD;
  pair.baseTokenPrice = ZERO_BD;
  pair.quoteTokenPrice = ZERO_BD;
  //Supplementary data
  pair.type = "AMMV2";
  pair.creator = event.transaction.from;
  pair.owner = event.transaction.from;
  pair.i = ZERO_BI;
  pair.k = ZERO_BI;
  pair.feeRate = event.params.feeRate;
  pair.lpFeeRate = convertTokenToDecimal(event.params.feeRate, BI_18);
  pair.untrackedBaseVolume = ZERO_BD;
  pair.untrackedQuoteVolume = ZERO_BD;
  pair.untrackedVolumeUSD = ZERO_BD;
  pair.createdAtTimestamp = event.block.timestamp;
  pair.createdAtBlockNumber = event.block.number;
  pair.liquidityProviderCount = ZERO_BI;
  pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
  pair.maintainer = Address.fromString(ADDRESS_ZERO);
  pair.lpMtRatio = BigInt.fromI32(6);
  pair.mtFeeRate = event.params.feeRate.div(pair.lpMtRatio);
  pair.mtFeeBase = ZERO_BD;
  pair.mtFeeQuote = ZERO_BD;
  pair.mtFeeUSD = ZERO_BD;
  pair.isTradeAllowed = true;
  pair.isDepositBaseAllowed = true;
  pair.isDepositQuoteAllowed = true;
  pair.lastTradePrice = ZERO_BD;
  pair.feeBase = ZERO_BD;
  pair.feeQuote = ZERO_BD;
  pair.feeUSD = ZERO_BD;
  pair.txCount = ZERO_BI;
  pair.traderCount = ZERO_BI;
  let lpToken = createLpToken(event.params.pair, pair as Pair);
  lpToken.updatedAt = event.block.timestamp;
  lpToken.save();
  pair.baseLpToken = lpToken.id;
  pair.quoteLpToken = lpToken.id;

  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair);

  // save updated values
  baseToken.updatedAt = event.block.timestamp;
  baseToken.save();
  quoteToken.updatedAt = event.block.timestamp;
  quoteToken.save();
  pair.updatedAt = event.block.timestamp;
  pair.save();
  factory.updatedAt = event.block.timestamp;
  factory.save();
}
