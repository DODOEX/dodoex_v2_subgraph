import { BigInt } from "@graphprotocol/graph-ts";

import { Bundle, Pool, Token } from "../../../types/amm-v3/schema";
import { Initialize } from "../../../types/amm-v3/templates/Pool/Pool";
import { getSubgraphConfig, SubgraphConfig } from "../utils/chains";
import {
  updatePoolDayData,
  updatePoolHourData,
} from "../utils/intervalUpdates";
import { findNativePerToken, getNativePriceInUSD } from "../utils/pricing";
import { updatePairDayData, updatePairHourData } from "../supplementaryData";

export function handleInitialize(event: Initialize): void {
  handleInitializeHelper(event);
}

export function handleInitializeHelper(
  event: Initialize,
  subgraphConfig: SubgraphConfig = getSubgraphConfig()
): void {
  const stablecoinWrappedNativePoolAddress =
    subgraphConfig.stablecoinWrappedNativePoolAddress;
  const stablecoinIsToken0 = subgraphConfig.stablecoinIsToken0;
  const wrappedNativeAddress = subgraphConfig.wrappedNativeAddress;
  const stablecoinAddresses = subgraphConfig.stablecoinAddresses;
  const minimumNativeLocked = subgraphConfig.minimumNativeLocked;

  // update pool sqrt price and tick
  const pool = Pool.load(event.address.toHexString())!;
  pool.sqrtPrice = event.params.sqrtPriceX96;
  pool.tick = BigInt.fromI32(event.params.tick);
  pool.updatedAt = event.block.timestamp;
  pool.save();

  // update token prices
  const token0 = Token.load(pool.token0);
  const token1 = Token.load(pool.token1);

  // update ETH price now that prices could have changed
  const bundle = Bundle.load("1")!;
  bundle.ethPriceUSD = getNativePriceInUSD(
    stablecoinWrappedNativePoolAddress,
    stablecoinIsToken0
  );
  bundle.updatedAt = event.block.timestamp;
  bundle.save();

  const poolDayData = updatePoolDayData(event);
  const poolHourData = updatePoolHourData(event);
  poolDayData.updatedAt = event.block.timestamp;
  poolHourData.updatedAt = event.block.timestamp;
  poolDayData.save();
  poolHourData.save();
  updatePairHourData(poolHourData);
  updatePairDayData(poolDayData);

  // update token prices
  if (token0 && token1) {
    token0.derivedETH = findNativePerToken(
      token0 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumNativeLocked
    );
    token1.derivedETH = findNativePerToken(
      token1 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumNativeLocked
    );
    token0.updatedAt = event.block.timestamp;
    token0.save();
    token1.updatedAt = event.block.timestamp;
    token1.save();
  }
}
