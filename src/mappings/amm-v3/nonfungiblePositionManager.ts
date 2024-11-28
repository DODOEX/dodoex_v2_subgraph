import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";

import {
  IncreaseLiquidity as IncreaseLiquidityEvent,
  DecreaseLiquidity as DecreaseLiquidityEvent,
  NonfungiblePositionManager,
} from "../../types/amm-v3/NonfungiblePositionManager/NonfungiblePositionManager";
import {
  LiquidityHistory,
  LiquidityPosition,
  LiquidityTracker,
  Pool,
} from "../../types/amm-v3/schema";
import { ZERO_BD } from "../constant";
import { createLpToken, createPair, createUser } from "./supplementaryData";
import { convertTokenToDecimal } from "./utils";

export function handleIncreaseLiquidity(event: IncreaseLiquidityEvent): void {
  const nonfungiblePositionManager = NonfungiblePositionManager.bind(
    event.address
  );
  const positionRes = nonfungiblePositionManager.try_positions(
    event.params.tokenId
  );
  if (positionRes.reverted) {
    log.error("Failed to get position data {}", [
      event.transaction.hash.toHexString(),
    ]);
  }
  const position = positionRes.value;
  let liquidityTrackerId = event.transaction.hash
    .toHexString()
    .concat("#")
    .concat(event.params.liquidity.toString())
    .concat("#")
    .concat(event.params.amount0.toString())
    .concat("#")
    .concat(event.params.amount1.toString());
  let liquidityTracker = LiquidityTracker.load(liquidityTrackerId);
  if (
    liquidityTracker != null &&
    liquidityTracker.tickLower.toI32() == position.getTickLower() &&
    liquidityTracker.tickUpper.toI32() == position.getTickUpper()
  ) {
    updateLpPosition(
      liquidityTracker.pool,
      event.params.liquidity,
      event.params.amount0,
      event.params.amount1,
      liquidityTracker.tickLower,
      liquidityTracker.tickUpper,
      event.params.tokenId.toString(),
      position.getLiquidity(),
      "DEPOSIT",
      event
    );
    liquidityTracker.tokenId = event.params.tokenId;
    liquidityTracker.save();
  }
}

export function handleDecreaseLiquidity(event: DecreaseLiquidityEvent): void {
  const nonfungiblePositionManager = NonfungiblePositionManager.bind(
    event.address
  );
  const positionRes = nonfungiblePositionManager.try_positions(
    event.params.tokenId
  );
  if (positionRes.reverted) {
    log.error("Failed to get position data {}", [
      event.transaction.hash.toHexString(),
    ]);
  }
  const position = positionRes.value;
  let liquidityTrackerId = event.transaction.hash
    .toHexString()
    .concat("#")
    .concat(event.params.liquidity.toString())
    .concat("#")
    .concat(event.params.amount0.toString())
    .concat("#")
    .concat(event.params.amount1.toString());
  let liquidityTracker = LiquidityTracker.load(liquidityTrackerId);
  if (
    liquidityTracker != null &&
    liquidityTracker.tickLower.toI32() == position.getTickLower() &&
    liquidityTracker.tickUpper.toI32() == position.getTickUpper()
  ) {
    updateLpPosition(
      liquidityTracker.pool,
      event.params.liquidity,
      event.params.amount0,
      event.params.amount1,
      liquidityTracker.tickLower,
      liquidityTracker.tickUpper,
      event.params.tokenId.toString(),
      position.getLiquidity(),
      "WITHDRAW",
      event
    );
    liquidityTracker.tokenId = event.params.tokenId;
    liquidityTracker.save();
  }
}

function updateLpPosition(
  poolAddress: string,
  amount: BigInt,
  amount0: BigInt,
  amount1: BigInt,
  tickLower: BigInt,
  tickUpper: BigInt,
  tokenId: string,
  liquidityTokenBalance: BigInt,
  type: string,
  event: ethereum.Event
): void {
  const pool = Pool.load(poolAddress)!;
  let pair = createPair(pool);
  let user = createUser(event.transaction.from, event.block.timestamp);
  let lpToken = createLpToken(event.address, pair);
  lpToken.updatedAt = event.block.timestamp;
  lpToken.save();
  let tickId = "#"
    .concat(tickLower.toString())
    .concat("#")
    .concat(tickUpper.toString());
  let liquidityPositionID = user.id
    .concat("-")
    .concat(event.address.toHexString())
    .concat(tickId)
    .concat("#")
    .concat(tokenId);
  let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
  if (liquidityPosition == null) {
    liquidityPosition = new LiquidityPosition(liquidityPositionID);
    liquidityPosition.pair = event.address.toHexString();
    liquidityPosition.user = user.id;
    liquidityPosition.liquidityTokenBalance = ZERO_BD;
    liquidityPosition.lpToken = lpToken.id;
    liquidityPosition.lastTxTime = event.block.timestamp;
    liquidityPosition.liquidityTokenInMining = ZERO_BD;
  }
  liquidityPosition.liquidityTokenBalance =
    liquidityTokenBalance.toBigDecimal();
  liquidityPosition.lastTxTime = event.block.timestamp;
  let liquidityHistoryID = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString())
    .concat(tickId)
    .concat("#")
    .concat(tokenId);
  let liquidityHistory = LiquidityHistory.load(liquidityHistoryID);
  if (liquidityHistory == null) {
    liquidityHistory = new LiquidityHistory(liquidityHistoryID);
    liquidityHistory.block = event.block.number;
    liquidityHistory.hash = event.transaction.hash.toHexString();
    liquidityHistory.from = event.transaction.from;
    liquidityHistory.pair = event.address.toHexString();
    liquidityHistory.timestamp = event.block.timestamp;
    liquidityHistory.user = user.id;
    liquidityHistory.amount = amount.toBigDecimal();
    liquidityHistory.balance = liquidityPosition.liquidityTokenBalance;
    liquidityHistory.lpToken = lpToken.id;
    liquidityHistory.type = type;
    liquidityHistory.baseReserve = pair.baseReserve;
    liquidityHistory.quoteReserve = pair.quoteReserve;
    liquidityHistory.lpTokenTotalSupply = convertTokenToDecimal(
      lpToken.totalSupply,
      lpToken.decimals
    );
    liquidityHistory.baseAmountChange = amount0.toBigDecimal();
    liquidityHistory.quoteAmountChange = amount1.toBigDecimal();
  }
  liquidityPosition.updatedAt = event.block.timestamp;
  liquidityHistory.updatedAt = event.block.timestamp;
  liquidityPosition.save();
  liquidityHistory.save();
}
