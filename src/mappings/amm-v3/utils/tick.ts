import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { Tick } from "../../../types/amm-v3/schema";
import { Mint as MintEvent } from "../../../types/amm-v3/templates/Pool/Pool";
import { fastExponentiation, safeDiv } from "./index";
import { ONE_BD, ZERO_BI } from "../../constant";

export function createTick(
  tickId: string,
  tickIdx: number,
  poolId: string,
  event: MintEvent
): Tick {
  const tick = new Tick(tickId);
  tick.tickIdx = BigInt.fromI32(tickIdx as i32);
  tick.pool = poolId;
  tick.poolAddress = poolId;

  tick.createdAtTimestamp = event.block.timestamp;
  tick.createdAtBlockNumber = event.block.number;
  tick.liquidityGross = ZERO_BI;
  tick.liquidityNet = ZERO_BI;

  tick.price0 = ONE_BD;
  tick.price1 = ONE_BD;

  // 1.0001^tick is token1/token0.
  const price0 = fastExponentiation(BigDecimal.fromString("1.0001"), tickIdx);
  tick.price0 = price0;
  tick.price1 = safeDiv(ONE_BD, price0);

  return tick;
}
