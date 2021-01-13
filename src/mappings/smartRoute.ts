import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token} from "../types/schema"
import {OrderHistory as OrderHistoryV1} from "../types/DODOV1Proxy01/DODOV1Proxy01"
import {createToken, createUser, ZERO_BI, ZERO_BD, ONE_BI, convertTokenToDecimal} from "./helpers"

export function handleOrderHistory(event: OrderHistoryV1): void {
    let user = createUser(event.transaction.from);
    let fromToken = createToken(event.params.fromToken,event);
    let toToken = createToken(event.params.toToken,event);
    let dealedFromAmount = convertTokenToDecimal(event.params.fromAmount, fromToken.decimals);
    let dealedToAmount = convertTokenToDecimal(event.params.returnAmount, toToken.decimals);
    //todo (更新交换的token的行情价)、计算交换的usd数量
    let swappedUSDC = ZERO_BD;

    //1、更新用户交易数据(用户的交易次数在下层)
    user.usdcSwapped = user.usdcSwapped.plus(swappedUSDC);
    user.txCount = user.txCount.plus(ONE_BI);
    user.save();

    //2、更新两个token的数据
    fromToken.tradeVolume = fromToken.tradeVolume.plus(dealedFromAmount);
    fromToken.txCount = fromToken.txCount.plus(ONE_BI);
    fromToken.tradeVolumeUSDC = fromToken.tradeVolumeUSDC.plus(swappedUSDC);

    toToken.tradeVolume = toToken.tradeVolume.plus(dealedToAmount);
    toToken.txCount = toToken.txCount.plus(ONE_BI);
    toToken.tradeVolumeUSDC = toToken.tradeVolumeUSDC.plus(swappedUSDC);
    fromToken.save();
    toToken.save();

    //不更新pair，pair合约自身被调用时更新

    //3、更OrderHistory数据
    let orderHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString())
    let orderHistory = OrderHistory.load(orderHistoryID);
    if (orderHistory == null) {
        orderHistory = new OrderHistory(orderHistoryID);
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
        orderHistory.amountUSDC = swappedUSDC;
        orderHistory.save();
    }

}
