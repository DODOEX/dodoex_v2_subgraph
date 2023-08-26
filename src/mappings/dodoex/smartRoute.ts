import {
  OrderHistory,
  TokenDayData,
  IncentiveRewardHistory,
  Pair,
  Token,
  Transaction,
} from "../../types/dodoex/schema";
import { OrderHistory as OrderHistoryV2 } from "../../types/dodoex/DODOV2Proxy02/DODOV2Proxy02";
import {
  createToken,
  createUser,
  ZERO_BD,
  ONE_BI,
  convertTokenToDecimal,
  getDODOZoo,
  updateVirtualPairVolume,
  updateTokenTraderCount,
} from "./helpers";
import { SOURCE_SMART_ROUTE, TRANSACTION_TYPE_SWAP } from "../constant";
import { Address, BigInt, dataSource, store } from "@graphprotocol/graph-ts";
import {
  trimTokenData,
  updateTokenDayData,
  getDodoDayData,
  increaseVolumeAndFee,
  decreaseVolumeAndFee,
} from "./dayUpdates";
import { calculateUsdVolume } from "./pricing";
import { addTransaction } from "./transaction";

export function handleOrderHistory(event: OrderHistoryV2): void {
  const network = dataSource.network();
  if (
    network == "mainnet" &&
    (event.params.fromToken.toHexString() ==
      "0x61786a044192a13b75130d4c96e9b59efd9c0da2" ||
      event.params.toToken.toHexString() ==
        "0x61786a044192a13b75130d4c96e9b59efd9c0da2")
  )
    return;
  let transaction = addTransaction(
    event,
    event.transaction.from.toHexString(),
    TRANSACTION_TYPE_SWAP
  );

  let user = createUser(event.transaction.from, event);
  let fromToken = createToken(event.params.fromToken, event);
  let toToken = createToken(event.params.toToken, event);
  let dealedFromAmount = convertTokenToDecimal(
    event.params.fromAmount,
    fromToken.decimals
  );
  let dealedToAmount = convertTokenToDecimal(
    event.params.returnAmount,
    toToken.decimals
  );

  //更新时间戳
  user.updatedAt = event.block.timestamp;
  fromToken.updatedAt = event.block.timestamp;
  toToken.updatedAt = event.block.timestamp;

  let trim = false;
  let volumeUSD = calculateUsdVolume(
    fromToken as Token,
    toToken as Token,
    dealedFromAmount,
    dealedToAmount,
    event.block.timestamp
  );
  if (volumeUSD.equals(ZERO_BD)) {
    fromToken.untrackedVolume = fromToken.untrackedVolume.plus(
      dealedFromAmount
    );
    toToken.untrackedVolume = fromToken.untrackedVolume.plus(dealedToAmount);
  }

  fromToken.volumeUSD = fromToken.volumeUSD
    .plus(volumeUSD)
    .minus(transaction.volumeUSD);
  toToken.volumeUSD = toToken.volumeUSD
    .plus(volumeUSD)
    .minus(transaction.volumeUSD);

  //1、更新用户交易数据(用户的交易次数在下层)
  user.txCount = user.txCount.plus(ONE_BI);
  user.save();

  //2、更新两个token的数据
  fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
  fromToken.txCount = fromToken.txCount.plus(ONE_BI);

  toToken.tradeVolume = toToken.tradeVolume.plus(dealedToAmount);
  toToken.txCount = toToken.txCount.plus(ONE_BI);

  //3、trim
  for (let i = BigInt.fromI32(0); i.lt(event.logIndex); i = i.plus(ONE_BI)) {
    let orderHistoryAboveID = event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(i.toString());
    let orderHistoryAbove = OrderHistory.load(orderHistoryAboveID);
    if (orderHistoryAbove != null) {
      trimTokenData(
        createToken(Address.fromString(orderHistoryAbove.fromToken), event),
        orderHistoryAbove.amountIn,
        orderHistoryAbove.fromToken === fromToken.id
          ? ZERO_BD
          : orderHistoryAbove.amountIn,
        orderHistoryAbove.volumeUSD,
        event
      );
      trimTokenData(
        createToken(Address.fromString(orderHistoryAbove.toToken), event),
        orderHistoryAbove.amountOut,
        orderHistoryAbove.toToken === toToken.id
          ? ZERO_BD
          : orderHistoryAbove.amountOut,
        orderHistoryAbove.volumeUSD,
        event
      );
      decreaseVolumeAndFee(event, orderHistoryAbove.volumeUSD, ZERO_BD);

      store.remove("OrderHistory", orderHistoryAboveID);
      trim = true;
    }
  }

  if (trim === false) {
    updateVirtualPairVolume(event, dealedFromAmount, dealedToAmount, volumeUSD);
  }

  fromToken.save();
  toToken.save();

  //4、更OrderHistory数据
  let orderHistoryID = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  let orderHistory = OrderHistory.load(orderHistoryID);
  if (orderHistory == null) {
    orderHistory = new OrderHistory(orderHistoryID);
    orderHistory.source = SOURCE_SMART_ROUTE;
    orderHistory.hash = event.transaction.hash.toHexString();
    orderHistory.timestamp = event.block.timestamp;
    orderHistory.block = event.block.number;
    orderHistory.fromToken = fromToken.id;
    orderHistory.toToken = toToken.id;
    orderHistory.from = event.transaction.from;
    orderHistory.to = event.params.sender;
    orderHistory.sender = event.params.sender;
    orderHistory.amountIn = dealedFromAmount;
    orderHistory.amountOut = dealedToAmount;
    orderHistory.logIndex = event.transaction.index;
    orderHistory.volumeUSD = volumeUSD;

    let incentiveRewardHistory = IncentiveRewardHistory.load(
      event.transaction.hash.toHexString()
    );
    if (incentiveRewardHistory != null) {
      orderHistory.tradingReward = incentiveRewardHistory.amount;
    } else {
      orderHistory.tradingReward = ZERO_BD;
    }
  }
  orderHistory.updatedAt = event.block.timestamp;
  orderHistory.save();

  //更新token统计信息
  let fromTokenDayData = updateTokenDayData(fromToken, event);
  let toTokenDayData = updateTokenDayData(toToken, event);
  fromTokenDayData.volume = fromTokenDayData.volume.plus(dealedFromAmount);
  toTokenDayData.volume = toTokenDayData.volume.plus(dealedToAmount);
  fromTokenDayData.save();
  toTokenDayData.save();

  //更新DODOZoo
  let dodoZoo = getDODOZoo();
  dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);
  dodoZoo.volumeUSD = dodoZoo.volumeUSD.plus(volumeUSD);
  dodoZoo.save();
  let dodoDayData = getDodoDayData(event);
  dodoDayData.volumeUSD = dodoDayData.volumeUSD
    .plus(volumeUSD)
    .minus(transaction.volumeUSD);
  dodoDayData.save();

  updateTokenTraderCount(event.params.fromToken, event.transaction.from, event);
  updateTokenTraderCount(event.params.toToken, event.transaction.from, event);
  increaseVolumeAndFee(event, volumeUSD, ZERO_BD);
}
