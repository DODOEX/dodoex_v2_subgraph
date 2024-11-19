/* eslint-disable prefer-const */
import {
  Address,
  BigDecimal,
  BigInt,
  log,
  store,
} from "@graphprotocol/graph-ts";

import {
  Bundle,
  Burn as BurnEvent,
  Mint as MintEvent,
  Pair,
  Swap as SwapEvent,
  Token,
  Transaction,
  AMMFactory,
  LiquidityPosition,
  LiquidityHistory,
  OrderHistory,
} from "../../types/amm-v2/schema";
import {
  Burn,
  Mint,
  Swap,
  Sync,
  Transfer,
  FeeRateChange,
  LpMtRatioChange,
} from "../../types/amm-v2/templates/Pair/Pair";
import {
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
  updateAMMDayData,
} from "./dayUpdates";
import {
  ADDRESS_ZERO,
  BI_18,
  ONE_BI,
  ZERO_BD,
  FACTORY_ADDRESS,
  ZERO_BI,
  SMART_ROUTE_ADDRESSES,
  SOURCE_POOL_SWAP,
} from "../constant";
import { convertTokenToDecimal, createLpToken, createUser } from "./helpers";
import {
  findEthPerToken,
  getEthPriceInUSD,
  getTrackedLiquidityUSD,
  getTrackedVolumeUSD,
} from "./pricing";

function isCompleteMint(mintId: string): boolean {
  return MintEvent.load(mintId)!.sender !== null; // sufficient checks
}

export function handleTransfer(event: Transfer): void {
  // ignore initial transfers for first adds
  if (
    event.params.to.toHexString() == ADDRESS_ZERO &&
    event.params.value.equals(BigInt.fromI32(1000))
  ) {
    return;
  }

  let factory = AMMFactory.load(FACTORY_ADDRESS)!;
  let transactionHash = event.transaction.hash.toHexString();

  // user stats
  let from = event.params.from;
  let fromUser = createUser(from, event.block.timestamp);
  let to = event.params.to;
  let toUser = createUser(to, event.block.timestamp);

  // get pair and load contract
  let pair = Pair.load(event.address.toHexString())!;

  // liquidity token amount being transfered
  let value = convertTokenToDecimal(event.params.value, BI_18);

  // get or create transaction
  let transaction = Transaction.load(transactionHash);
  if (transaction === null) {
    transaction = new Transaction(transactionHash);
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.from = event.transaction.from.toHexString();
    if (event.transaction.to)
      transaction.to = (event.transaction.to as Address).toHexString();
    transaction.sender = transaction.from;
    transaction.address = event.address;
    transaction.type = "TRANSFER";
    transaction.tokens = [];
    transaction.volumeUSD = ZERO_BD;
    transaction.timestamp = event.block.timestamp;
    transaction.mints = [];
    transaction.burns = [];
    transaction.swaps = [];
  }

  // mints
  let mints = transaction.mints;
  // part of the erc-20 standard (which is also the pool), whenever you mint new tokens, the from address is 0x0..0
  // the pool is also the erc-20 that gets minted and transferred around
  if (from.toHexString() == ADDRESS_ZERO) {
    // update total supply
    pair.totalSupply = pair.totalSupply.plus(value);
    pair.updatedAt = event.block.timestamp;
    pair.save();

    // create new mint if no mints so far or if last one is done already
    // transfers and mints come in pairs, but there could be a case where that doesn't happen and it might break
    // this is to make sure all the mints are under the same transaction
    if (mints.length === 0 || isCompleteMint(mints[mints.length - 1])) {
      let mint = new MintEvent(
        event.transaction.hash
          .toHexString()
          .concat("-")
          .concat(BigInt.fromI32(mints.length).toString())
      );
      mint.transaction = transaction.id;
      mint.pair = pair.id;
      mint.to = to;
      mint.liquidity = value;
      mint.timestamp = transaction.timestamp;
      mint.transaction = transaction.id;
      mint.updatedAt = event.block.timestamp;
      mint.save();

      // update mints in transaction
      transaction.mints = mints.concat([mint.id]);

      // save entities
      transaction.updatedAt = event.block.timestamp;
      transaction.save();
      factory.updatedAt = event.block.timestamp;
      factory.save();
    }
  }

  // case where direct send first on ETH withdrawls
  // for every burn event, there is a transfer first from the LP to the pool (erc-20)
  // when you LP, you get an ERC-20 token which is the accounting token of the LP position
  // the thing that's actually getting transfered is the LP account token
  if (event.params.to.toHexString() == pair.id) {
    let burns = transaction.burns;
    let burn = new BurnEvent(
      event.transaction.hash
        .toHexString()
        .concat("-")
        .concat(BigInt.fromI32(burns.length).toString())
    );
    burn.transaction = transaction.id;
    burn.pair = pair.id;
    burn.liquidity = value;
    burn.timestamp = transaction.timestamp;
    burn.to = event.params.to;
    burn.sender = event.params.from;
    burn.needsComplete = true;
    burn.transaction = transaction.id;
    burn.updatedAt = event.block.timestamp;
    burn.save();

    // TODO: Consider using .concat() for handling array updates to protect
    // against unintended side effects for other code paths.
    burns.push(burn.id);
    transaction.burns = burns;
    transaction.updatedAt = event.block.timestamp;
    transaction.save();
  }

  // burn
  // there's two transfers for the LP token,
  // first its going to move from the LP back to the pool, and then it will go from the pool to the zero address
  if (
    event.params.to.toHexString() == ADDRESS_ZERO &&
    event.params.from.toHexString() == pair.id
  ) {
    pair.totalSupply = pair.totalSupply.minus(value);
    pair.updatedAt = event.block.timestamp;
    pair.save();

    // this is a new instance of a logical burn
    let burns = transaction.burns;
    let burn: BurnEvent;
    // this block creates the burn or gets the reference to it if it already exists
    if (burns.length > 0) {
      let currentBurn = BurnEvent.load(burns[burns.length - 1])!;
      if (currentBurn.needsComplete) {
        burn = currentBurn as BurnEvent;
      } else {
        burn = new BurnEvent(
          event.transaction.hash
            .toHexString()
            .concat("-")
            .concat(BigInt.fromI32(burns.length).toString())
        );
        burn.transaction = transaction.id;
        burn.needsComplete = false;
        burn.pair = pair.id;
        burn.liquidity = value;
        burn.transaction = transaction.id;
        burn.timestamp = transaction.timestamp;
      }
    } else {
      burn = new BurnEvent(
        event.transaction.hash
          .toHexString()
          .concat("-")
          .concat(BigInt.fromI32(burns.length).toString())
      );
      burn.transaction = transaction.id;
      burn.needsComplete = false;
      burn.pair = pair.id;
      burn.liquidity = value;
      burn.transaction = transaction.id;
      burn.timestamp = transaction.timestamp;
    }

    // if this logical burn included a fee mint, account for this
    // what is a fee mint?
    // how are fees collected on v2?
    // when you're an LP in v2, you're earning fees in terms of LP tokens, so when you go to burn your position, burn and collect fees at the same time
    // protocol is sending the LP something and we think it's a mint when it's not and it's really fees
    if (mints.length !== 0 && !isCompleteMint(mints[mints.length - 1])) {
      let mint = MintEvent.load(mints[mints.length - 1])!;
      burn.feeTo = mint.to;
      burn.feeLiquidity = mint.liquidity;
      // remove the logical mint
      store.remove("Mint", mints[mints.length - 1]);
      // update the transaction

      // TODO: Consider using .slice().pop() to protect against unintended
      // side effects for other code paths.
      mints.pop();
      transaction.mints = mints;
      transaction.updatedAt = event.block.timestamp;
      transaction.save();
    }
    // when you collect fees or burn liquidity what are the events that get triggered
    // not sure why this replaced the last one instead of updating
    burn.updatedAt = event.block.timestamp;
    burn.save();
    // if accessing last one, replace it
    if (burn.needsComplete) {
      // TODO: Consider using .slice(0, -1).concat() to protect against
      // unintended side effects for other code paths.
      burns[burns.length - 1] = burn.id;
    }
    // else add new one
    else {
      // TODO: Consider using .concat() for handling array updates to protect
      // against unintended side effects for other code paths.
      burns.push(burn.id);
    }
    transaction.burns = burns;
    transaction.updatedAt = event.block.timestamp;
    transaction.save();
  }

  transaction.updatedAt = event.block.timestamp;
  transaction.save();

  //Supplementary data
  if (
    event.params.to.toHexString() == ADDRESS_ZERO ||
    event.params.from.toHexString() == ADDRESS_ZERO
  ) {
    return;
  }
  let lpToken = createLpToken(event.address, pair as Pair);
  lpToken.updatedAt = event.block.timestamp;
  lpToken.save();
  {
    let toUserLiquidityPositionID = toUser.id.concat("-").concat(lpToken.id);
    let position = LiquidityPosition.load(toUserLiquidityPositionID);
    if (position == null) {
      position = new LiquidityPosition(toUserLiquidityPositionID);
      position.pair = event.address.toHexString();
      position.user = event.params.to.toHexString();
      position.liquidityTokenBalance = ZERO_BD;
      position.lpToken = lpToken.id;
      position.lastTxTime = event.block.timestamp;
      position.liquidityTokenInMining = ZERO_BD;
    }
    position.liquidityTokenBalance = position.liquidityTokenBalance.plus(value);
    position.updatedAt = event.block.timestamp;
    position.save();
  }

  {
    let fromUserLiquidityPositionID = fromUser.id
      .concat("-")
      .concat(lpToken.id);
    let position = LiquidityPosition.load(fromUserLiquidityPositionID);
    if (position == null) {
      position = new LiquidityPosition(fromUserLiquidityPositionID);
      position.pair = event.address.toHexString();
      position.user = event.params.to.toHexString();
      position.liquidityTokenBalance = ZERO_BD;
      position.lpToken = lpToken.id;
      position.lastTxTime = ZERO_BI;
      position.liquidityTokenInMining = ZERO_BD;
    }
    position.liquidityTokenBalance =
      position.liquidityTokenBalance.minus(value);
    position.updatedAt = event.block.timestamp;
    position.save();
  }
}

export function handleSync(event: Sync): void {
  let pair = Pair.load(event.address.toHex())!;
  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }
  let amm = AMMFactory.load(FACTORY_ADDRESS)!;

  // reset factory liquidity by subtracting onluy tarcked liquidity
  amm.totalLiquidityETH = amm.totalLiquidityETH.minus(
    pair.trackedReserveETH as BigDecimal
  );

  // reset token total liquidity amounts
  token0.totalLiquidity = token0.totalLiquidity.minus(pair.baseReserve);
  token1.totalLiquidity = token1.totalLiquidity.minus(pair.quoteReserve);

  pair.baseReserve = convertTokenToDecimal(
    event.params.reserve0,
    token0.decimals
  );
  pair.quoteReserve = convertTokenToDecimal(
    event.params.reserve1,
    token1.decimals
  );

  if (pair.quoteReserve.notEqual(ZERO_BD))
    pair.baseTokenPrice = pair.baseReserve.div(pair.quoteReserve);
  else pair.baseTokenPrice = ZERO_BD;
  if (pair.baseReserve.notEqual(ZERO_BD))
    pair.quoteTokenPrice = pair.quoteReserve.div(pair.baseReserve);
  else pair.quoteTokenPrice = ZERO_BD;

  pair.updatedAt = event.block.timestamp;
  pair.save();

  // update ETH price now that reserves could have changed
  let bundle = Bundle.load("1")!;
  bundle.ethPrice = getEthPriceInUSD();
  bundle.updatedAt = event.block.timestamp;
  bundle.save();

  token0.derivedETH = findEthPerToken(token0 as Token);
  token1.derivedETH = findEthPerToken(token1 as Token);
  token0.updatedAt = event.block.timestamp;
  token0.save();
  token1.updatedAt = event.block.timestamp;
  token1.save();

  // get tracked liquidity - will be 0 if neither is in whitelist
  let trackedLiquidityETH: BigDecimal;
  if (bundle.ethPrice.notEqual(ZERO_BD)) {
    trackedLiquidityETH = getTrackedLiquidityUSD(
      pair.baseReserve,
      token0 as Token,
      pair.quoteReserve,
      token1 as Token
    ).div(bundle.ethPrice);
  } else {
    trackedLiquidityETH = ZERO_BD;
  }

  // use derived amounts within pair
  pair.trackedReserveETH = trackedLiquidityETH;
  pair.reserveETH = pair.baseReserve
    .times(token0.derivedETH as BigDecimal)
    .plus(pair.quoteReserve.times(token1.derivedETH as BigDecimal));
  pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice);

  // use tracked amounts globally
  amm.totalLiquidityETH = amm.totalLiquidityETH.plus(trackedLiquidityETH);
  amm.totalLiquidityUSD = amm.totalLiquidityETH.times(bundle.ethPrice);

  // now correctly set liquidity amounts for each token
  token0.totalLiquidity = token0.totalLiquidity.plus(pair.baseReserve);
  token1.totalLiquidity = token1.totalLiquidity.plus(pair.quoteReserve);

  // save entities
  pair.updatedAt = event.block.timestamp;
  pair.save();
  amm.updatedAt = event.block.timestamp;
  amm.save();
  token0.updatedAt = event.block.timestamp;
  token0.save();
  token1.updatedAt = event.block.timestamp;
  token1.save();
}

export function handleMint(event: Mint): void {
  // loaded from a previous handler creating this transaction
  // transfer event is emitted first and mint event is emitted afterwards, good to confirm with a protocol eng
  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    return;
  }

  let mints = transaction.mints;
  let mint = MintEvent.load(mints[mints.length - 1]);

  if (mint === null) {
    return;
  }

  let pair = Pair.load(event.address.toHex())!;
  let amm = AMMFactory.load(FACTORY_ADDRESS)!;

  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }

  // update exchange info (except balances, sync will cover that)
  let token0Amount = convertTokenToDecimal(
    event.params.amount0,
    token0.decimals
  );
  let token1Amount = convertTokenToDecimal(
    event.params.amount1,
    token1.decimals
  );

  // update txn counts
  token0.txCount = token0.txCount.plus(ONE_BI);
  token1.txCount = token1.txCount.plus(ONE_BI);

  // get new amounts of USD and ETH for tracking
  let bundle = Bundle.load("1")!;
  let amountTotalUSD = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount))
    .times(bundle.ethPrice);

  // update txn counts
  pair.txCount = pair.txCount.plus(ONE_BI);
  amm.txCount = amm.txCount.plus(ONE_BI);

  // save entities
  token0.updatedAt = event.block.timestamp;
  token0.save();
  token1.updatedAt = event.block.timestamp;
  token1.save();
  pair.updatedAt = event.block.timestamp;
  pair.save();
  amm.updatedAt = event.block.timestamp;
  amm.save();

  mint.sender = event.params.sender;
  mint.amount0 = token0Amount as BigDecimal;
  mint.amount1 = token1Amount as BigDecimal;
  mint.logIndex = event.logIndex;
  mint.amountUSD = amountTotalUSD as BigDecimal;
  mint.updatedAt = event.block.timestamp;
  mint.save();

  // update day entities
  updatePairDayData(event);
  updatePairHourData(event);
  updateAMMDayData(event);
  updateTokenDayData(token0 as Token, event);
  updateTokenDayData(token1 as Token, event);

  //Supplementary data
  let lpToken = createLpToken(event.address, pair as Pair);
  lpToken.updatedAt = event.block.timestamp;
  lpToken.save();
  let liquidityPositionID = event.params.sender
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString());
  let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
  if (liquidityPosition == null) {
    liquidityPosition = new LiquidityPosition(liquidityPositionID);
    liquidityPosition.pair = event.address.toHexString();
    liquidityPosition.user = event.params.sender.toHexString();
    liquidityPosition.liquidityTokenBalance = ZERO_BD;
    liquidityPosition.lpToken = lpToken.id;
    liquidityPosition.lastTxTime = event.block.timestamp;
    liquidityPosition.liquidityTokenInMining = ZERO_BD;
  }
  //   liquidityPosition.liquidityTokenBalance = balance;
  let liquidityHistoryID = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  let liquidityHistory = LiquidityHistory.load(liquidityHistoryID);
  if (liquidityHistory == null) {
    liquidityHistory = new LiquidityHistory(liquidityHistoryID);
    liquidityHistory.block = event.block.number;
    liquidityHistory.hash = event.transaction.hash.toHexString();
    liquidityHistory.from = event.transaction.from;
    liquidityHistory.pair = event.address.toHexString();
    liquidityHistory.timestamp = event.block.timestamp;
    liquidityHistory.user = event.params.sender.toHexString();
    liquidityHistory.amount = ZERO_BD;
    liquidityHistory.balance = ZERO_BD;
    liquidityHistory.lpToken = lpToken.id;
    liquidityHistory.type = "DEPOSIT";
    liquidityHistory.baseReserve = pair.baseReserve;
    liquidityHistory.quoteReserve = pair.quoteReserve;
    liquidityHistory.lpTokenTotalSupply = convertTokenToDecimal(
      lpToken.totalSupply,
      lpToken.decimals
    );
    liquidityHistory.baseAmountChange = ZERO_BD;
    liquidityHistory.quoteAmountChange = ZERO_BD;
  }
  liquidityPosition.updatedAt = event.block.timestamp;
  liquidityHistory.updatedAt = event.block.timestamp;
  liquidityPosition.save();
  liquidityHistory.save();
}

export function handleBurn(event: Burn): void {
  let transaction = Transaction.load(event.transaction.hash.toHexString());

  // safety check
  if (transaction === null) {
    return;
  }

  let burns = transaction.burns;
  let burn = BurnEvent.load(burns[burns.length - 1]);

  if (burn === null) {
    return;
  }

  let pair = Pair.load(event.address.toHex())!;
  let amm = AMMFactory.load(FACTORY_ADDRESS)!;

  //update token info
  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }

  let token0Amount = convertTokenToDecimal(
    event.params.amount0,
    token0.decimals
  );
  let token1Amount = convertTokenToDecimal(
    event.params.amount1,
    token1.decimals
  );

  // update txn counts
  token0.txCount = token0.txCount.plus(ONE_BI);
  token1.txCount = token1.txCount.plus(ONE_BI);

  // get new amounts of USD and ETH for tracking
  let bundle = Bundle.load("1")!;
  let amountTotalUSD = token1.derivedETH
    .times(token1Amount)
    .plus(token0.derivedETH.times(token0Amount))
    .times(bundle.ethPrice);

  // update txn counts
  amm.txCount = amm.txCount.plus(ONE_BI);
  pair.txCount = pair.txCount.plus(ONE_BI);

  // update global counter and save
  token0.updatedAt = event.block.timestamp;
  token0.save();
  token1.updatedAt = event.block.timestamp;
  token1.save();
  pair.updatedAt = event.block.timestamp;
  pair.save();
  amm.updatedAt = event.block.timestamp;
  amm.save();

  // update burn
  // burn.sender = event.params.sender
  burn.amount0 = token0Amount as BigDecimal;
  burn.amount1 = token1Amount as BigDecimal;
  // burn.to = event.params.to
  burn.logIndex = event.logIndex;
  burn.amountUSD = amountTotalUSD as BigDecimal;
  burn.updatedAt = event.block.timestamp;
  burn.save();

  // update day entities
  updatePairDayData(event);
  updatePairHourData(event);
  updateAMMDayData(event);
  updateTokenDayData(token0 as Token, event);
  updateTokenDayData(token1 as Token, event);

  //Supplementary data
  let lpToken = createLpToken(event.address, pair as Pair);
  lpToken.updatedAt = event.block.timestamp;
  lpToken.save();
  let liquidityPositionID = event.params.sender
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString());
  let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
  if (liquidityPosition == null) {
    liquidityPosition = new LiquidityPosition(liquidityPositionID);
    liquidityPosition.pair = event.address.toHexString();
    liquidityPosition.user = event.params.sender.toHexString();
    liquidityPosition.liquidityTokenBalance = ZERO_BD;
    liquidityPosition.lpToken = lpToken.id;
    liquidityPosition.lastTxTime = event.block.timestamp;
    liquidityPosition.liquidityTokenInMining = ZERO_BD;
  }
  //   liquidityPosition.liquidityTokenBalance = balance;
  let liquidityHistoryID = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  let liquidityHistory = LiquidityHistory.load(liquidityHistoryID);
  if (liquidityHistory == null) {
    liquidityHistory = new LiquidityHistory(liquidityHistoryID);
    liquidityHistory.block = event.block.number;
    liquidityHistory.hash = event.transaction.hash.toHexString();
    liquidityHistory.from = event.transaction.from;
    liquidityHistory.pair = event.address.toHexString();
    liquidityHistory.timestamp = event.block.timestamp;
    liquidityHistory.user = event.params.sender.toHexString();
    liquidityHistory.amount = ZERO_BD;
    liquidityHistory.balance = ZERO_BD;
    liquidityHistory.lpToken = lpToken.id;
    liquidityHistory.type = "WITHDRAW";
    liquidityHistory.baseReserve = pair.baseReserve;
    liquidityHistory.quoteReserve = pair.quoteReserve;
    liquidityHistory.lpTokenTotalSupply = convertTokenToDecimal(
      lpToken.totalSupply,
      lpToken.decimals
    );
    liquidityHistory.baseAmountChange = ZERO_BD;
    liquidityHistory.quoteAmountChange = ZERO_BD;
  }
  liquidityPosition.updatedAt = event.block.timestamp;
  liquidityHistory.updatedAt = event.block.timestamp;
  liquidityPosition.save();
  liquidityHistory.save();
}

export function handleSwap(event: Swap): void {
  let pair = Pair.load(event.address.toHexString())!;
  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }
  let amount0In = convertTokenToDecimal(
    event.params.amount0In,
    token0.decimals
  );
  let amount1In = convertTokenToDecimal(
    event.params.amount1In,
    token1.decimals
  );
  let amount0Out = convertTokenToDecimal(
    event.params.amount0Out,
    token0.decimals
  );
  let amount1Out = convertTokenToDecimal(
    event.params.amount1Out,
    token1.decimals
  );

  // totals for volume updates
  let amount0Total = amount0Out.plus(amount0In);
  let amount1Total = amount1Out.plus(amount1In);

  // ETH/USD prices
  let bundle = Bundle.load("1")!;

  // get total amounts of derived USD and ETH for tracking
  let derivedAmountETH = token1.derivedETH
    .times(amount1Total)
    .plus(token0.derivedETH.times(amount0Total))
    .div(BigDecimal.fromString("2"));
  let derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice);

  // only accounts for volume through white listed tokens
  let trackedAmountUSD = getTrackedVolumeUSD(
    amount0Total,
    token0 as Token,
    amount1Total,
    token1 as Token,
    pair as Pair
  );

  let trackedAmountETH: BigDecimal;
  if (bundle.ethPrice.equals(ZERO_BD)) {
    trackedAmountETH = ZERO_BD;
  } else {
    trackedAmountETH = trackedAmountUSD.div(bundle.ethPrice);
  }

  // update token0 global volume and token liquidity stats
  token0.tradeVolume = token0.tradeVolume.plus(amount0In.plus(amount0Out));
  token0.tradeVolumeUSD = token0.tradeVolumeUSD.plus(trackedAmountUSD);
  token0.untrackedVolumeUSD = token0.untrackedVolumeUSD.plus(derivedAmountUSD);

  // update token1 global volume and token liquidity stats
  token1.tradeVolume = token1.tradeVolume.plus(amount1In.plus(amount1Out));
  token1.tradeVolumeUSD = token1.tradeVolumeUSD.plus(trackedAmountUSD);
  token1.untrackedVolumeUSD = token1.untrackedVolumeUSD.plus(derivedAmountUSD);

  // update txn counts
  token0.txCount = token0.txCount.plus(ONE_BI);
  token1.txCount = token1.txCount.plus(ONE_BI);

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = pair.volumeUSD.plus(trackedAmountUSD);
  pair.volumeBaseToken = pair.volumeBaseToken.plus(amount0Total);
  pair.volumeQuoteToken = pair.volumeQuoteToken.plus(amount1Total);
  pair.untrackedVolumeUSD = pair.untrackedVolumeUSD.plus(derivedAmountUSD);
  pair.txCount = pair.txCount.plus(ONE_BI);
  pair.updatedAt = event.block.timestamp;
  pair.save();

  // update global values, only used tracked amounts for volume
  let amm = AMMFactory.load(FACTORY_ADDRESS)!;
  amm.totalVolumeUSD = amm.totalVolumeUSD.plus(trackedAmountUSD);
  amm.totalVolumeETH = amm.totalVolumeETH.plus(trackedAmountETH);
  amm.untrackedVolumeUSD = amm.untrackedVolumeUSD.plus(derivedAmountUSD);
  amm.txCount = amm.txCount.plus(ONE_BI);

  // save entities
  pair.updatedAt = event.block.timestamp;
  pair.save();
  token0.updatedAt = event.block.timestamp;
  token0.save();
  token1.updatedAt = event.block.timestamp;
  token1.save();
  amm.updatedAt = event.block.timestamp;
  amm.save();

  let transaction = Transaction.load(event.transaction.hash.toHexString());
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.from = event.transaction.from.toHexString();
    if (event.transaction.to)
      transaction.to = (event.transaction.to as Address).toHexString();
    transaction.sender = transaction.from;
    transaction.address = event.address;
    transaction.type = "SWAP";
    transaction.tokens = [];
    transaction.volumeUSD = ZERO_BD;
    transaction.timestamp = event.block.timestamp;
    transaction.mints = [];
    transaction.burns = [];
    transaction.swaps = [];
  }
  let swaps = transaction.swaps;
  let swap = new SwapEvent(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(BigInt.fromI32(swaps.length).toString())
  );

  // update swap event
  swap.hash = event.transaction.hash.toHexString();
  swap.timestamp = transaction.timestamp;
  swap.pair = pair.id;
  swap.transaction = transaction.id;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;
  swap.fromToken = pair.baseToken;
  swap.toToken = pair.quoteToken;
  swap.to = event.params.to;
  swap.logIndex = event.logIndex;
  swap.amount0In = amount0In;
  swap.amountIn = amount0In;
  swap.amount1In = amount1In;
  swap.amount0Out = amount0Out;
  swap.amount1Out = amount1Out;
  swap.amountOut = amount1Out;
  swap.from = event.transaction.from;
  // use the tracked amount if we have it
  swap.amountUSD =
    trackedAmountUSD === ZERO_BD ? derivedAmountUSD : trackedAmountUSD;
  swap.feeBase = ZERO_BD;
  swap.feeQuote = ZERO_BD;
  swap.baseVolume = ZERO_BD;
  swap.quoteVolume = ZERO_BD;
  swap.volumeUSD = ZERO_BD;
  swap.updatedAt = event.block.timestamp;
  swap.save();

  // update the transaction

  // TODO: Consider using .concat() for handling array updates to protect
  // against unintended side effects for other code paths.
  swaps.push(swap.id);
  transaction.swaps = swaps;
  transaction.updatedAt = event.block.timestamp;
  transaction.save();

  // update day entities
  let pairDayData = updatePairDayData(event);
  let pairHourData = updatePairHourData(event);
  let ammDayData = updateAMMDayData(event);
  let token0DayData = updateTokenDayData(token0 as Token, event);
  let token1DayData = updateTokenDayData(token1 as Token, event);

  // swap specific updating
  ammDayData.dailyVolumeUSD = ammDayData.dailyVolumeUSD.plus(trackedAmountUSD);
  ammDayData.dailyVolumeETH = ammDayData.dailyVolumeETH.plus(trackedAmountETH);
  ammDayData.dailyVolumeUntracked =
    ammDayData.dailyVolumeUntracked.plus(derivedAmountUSD);
  ammDayData.updatedAt = event.block.timestamp;
  ammDayData.save();

  // swap specific updating for pair
  pairDayData.volumeBase = pairDayData.volumeBase.plus(amount0Total);
  pairDayData.volumeQuote = pairDayData.volumeQuote.plus(amount1Total);
  pairDayData.volumeUSD = pairDayData.volumeUSD.plus(trackedAmountUSD);
  pairDayData.updatedAt = event.block.timestamp;
  pairDayData.save();

  // update hourly pair data
  pairHourData.volumeBase = pairHourData.volumeBase.plus(amount0Total);
  pairHourData.volumeQuote = pairHourData.volumeQuote.plus(amount1Total);
  pairHourData.volumeUSD = pairHourData.volumeUSD.plus(trackedAmountUSD);
  pairHourData.updatedAt = event.block.timestamp;
  pairHourData.save();

  // swap specific updating for token0
  token0DayData.dailyVolumeToken =
    token0DayData.dailyVolumeToken.plus(amount0Total);
  token0DayData.dailyVolumeETH = token0DayData.dailyVolumeETH.plus(
    amount0Total.times(token0.derivedETH as BigDecimal)
  );
  token0DayData.dailyVolumeUSD = token0DayData.dailyVolumeUSD.plus(
    amount0Total.times(token0.derivedETH as BigDecimal).times(bundle.ethPrice)
  );
  token0DayData.updatedAt = event.block.timestamp;
  token0DayData.save();

  // swap specific updating
  token1DayData.dailyVolumeToken =
    token1DayData.dailyVolumeToken.plus(amount1Total);
  token1DayData.dailyVolumeETH = token1DayData.dailyVolumeETH.plus(
    amount1Total.times(token1.derivedETH as BigDecimal)
  );
  token1DayData.dailyVolumeUSD = token1DayData.dailyVolumeUSD.plus(
    amount1Total.times(token1.derivedETH as BigDecimal).times(bundle.ethPrice)
  );
  token1DayData.updatedAt = event.block.timestamp;
  token1DayData.save();

  //Supplementary data
  let swapID = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());

  let orderHistory = OrderHistory.load(swapID);
  if (
    SMART_ROUTE_ADDRESSES.indexOf(event.params.to.toHexString()) == -1 &&
    orderHistory == null
  ) {
    log.warning(`external swap from {},hash : {}`, [
      event.params.sender.toHexString(),
      event.transaction.hash.toHexString(),
    ]);
    orderHistory = new OrderHistory(swapID);
    orderHistory.source = SOURCE_POOL_SWAP;
    orderHistory.hash = event.transaction.hash.toHexString();
    orderHistory.timestamp = event.block.timestamp;
    orderHistory.block = event.block.number;
    orderHistory.fromToken = token0.id;
    orderHistory.toToken = token1.id;
    orderHistory.from = event.transaction.from;
    orderHistory.to = event.params.to;
    orderHistory.sender = event.params.to;
    orderHistory.amountIn = amount0In;
    orderHistory.amountOut = amount1Out;
    orderHistory.logIndex = event.logIndex;
    orderHistory.tradingReward = ZERO_BD;
    orderHistory.volumeUSD = trackedAmountUSD;
    orderHistory.updatedAt = event.block.timestamp;
    orderHistory.save();
  }
}

export function handleFeeRateChange(event: FeeRateChange): void {
  let pair = Pair.load(event.address.toHexString())!;
  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }
  pair.feeRate = event.params.feeRate;
  pair.lpFeeRate = convertTokenToDecimal(pair.feeRate, BI_18);
  pair.mtFeeRate = pair.feeRate.div(pair.lpMtRatio);
  pair.updatedAt = event.block.timestamp;
  pair.save();
}

export function handleLpMtRatioChange(event: LpMtRatioChange): void {
  let pair = Pair.load(event.address.toHexString())!;
  let token0 = Token.load(pair.baseToken);
  let token1 = Token.load(pair.quoteToken);
  if (token0 === null || token1 === null) {
    return;
  }
  pair.lpMtRatio = event.params.lpMtRatio;
  pair.mtFeeRate = pair.feeRate.div(pair.lpMtRatio);
  pair.updatedAt = event.block.timestamp;
  pair.save();
}
