/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";

import { Bundle, Pair, Token } from "../../types/amm-v2/schema";
import { factoryContract } from "./helpers";
import { ADDRESS_ZERO, ONE_BD, UNTRACKED_PAIRS, ZERO_BD } from "../constant";
import {
  DAI_WETH_PAIR,
  MINIMUM_LIQUIDITY_THRESHOLD_ETH,
  MINIMUM_USD_THRESHOLD_NEW_PAIRS,
  USDC_WETH_PAIR,
  USDT_WETH_PAIR,
  WETH_ADDRESS,
  WHITELIST,
} from "../constant";

export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let daiPair = Pair.load(DAI_WETH_PAIR); // dai is token0
  let usdcPair = Pair.load(USDC_WETH_PAIR); // usdc is token0
  let usdtPair = Pair.load(USDT_WETH_PAIR); // usdt is token1

  // all 3 have been created
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.quoteReserve
      .plus(usdcPair.quoteReserve)
      .plus(usdtPair.baseReserve);
    let daiWeight = daiPair.quoteReserve.div(totalLiquidityETH);
    let usdcWeight = usdcPair.quoteReserve.div(totalLiquidityETH);
    let usdtWeight = usdtPair.baseReserve.div(totalLiquidityETH);
    return daiPair.baseTokenPrice
      .times(daiWeight)
      .plus(usdcPair.baseTokenPrice.times(usdcWeight))
      .plus(usdtPair.quoteTokenPrice.times(usdtWeight));
    // dai and USDC have been created
  } else if (daiPair !== null && usdcPair !== null) {
    let totalLiquidityETH = daiPair.quoteReserve.plus(usdcPair.quoteReserve);
    let daiWeight = daiPair.quoteReserve.div(totalLiquidityETH);
    let usdcWeight = usdcPair.quoteReserve.div(totalLiquidityETH);
    return daiPair.baseTokenPrice
      .times(daiWeight)
      .plus(usdcPair.baseTokenPrice.times(usdcWeight));
    // USDC is the only pair so far
  } else if (usdcPair !== null) {
    return usdcPair.baseTokenPrice;
  } else {
    return ZERO_BD;
  }
}
/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(
      Address.fromString(token.id),
      Address.fromString(WHITELIST[i]),
      BigInt.fromI64(3000000000000000)
    );
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString());
      if (pair === null) {
        continue;
      }
      if (
        pair.baseToken == token.id &&
        pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        let token1 = Token.load(pair.quoteToken);
        if (token1 === null) {
          continue;
        }
        return pair.quoteTokenPrice.times(token1.derivedETH as BigDecimal); // return token1 per our token * Eth per token 1
      }
      if (
        pair.quoteToken == token.id &&
        pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)
      ) {
        let token0 = Token.load(pair.baseToken);
        if (token0 === null) {
          continue;
        }
        return pair.baseTokenPrice.times(token0.derivedETH as BigDecimal); // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load("1")!;
  let price0 = token0.derivedETH.times(bundle.ethPrice);
  let price1 = token1.derivedETH.times(bundle.ethPrice);

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD;
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    let reserve0USD = pair.baseReserve.times(price0);
    let reserve1USD = pair.quoteReserve.times(price1);
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD;
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (
        reserve0USD
          .times(BigDecimal.fromString("2"))
          .lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (
        reserve1USD
          .times(BigDecimal.fromString("2"))
          .lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)
      ) {
        return ZERO_BD;
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load("1")!;
  let price0 = token0.derivedETH.times(bundle.ethPrice);
  let price1 = token1.derivedETH.times(bundle.ethPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
