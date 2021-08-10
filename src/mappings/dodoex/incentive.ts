import {
    IncentiveRewardHistory,
    TradingIncentive
} from "../../types/dodoex/schema"
import {
    createUser,
    ZERO_BI,
    ZERO_BD,
    BI_18,
    ONE_BI,
    convertTokenToDecimal,
} from "./helpers"

import {Incentive} from "../../types/dodoex/DODOIncentive/DODOIncentive"
import {dataSource} from "@graphprotocol/graph-ts";

export function handleIncentive(event: Incentive): void {
    let user = createUser(event.params.user,event);
    let incentiveRewardHistoryID = event.transaction.hash.toHexString();
    let incentiveRewardHistory = IncentiveRewardHistory.load(incentiveRewardHistoryID);
    let amount = convertTokenToDecimal(event.params.reward, BI_18);

    if (incentiveRewardHistory == null) {
        incentiveRewardHistory = new IncentiveRewardHistory(incentiveRewardHistoryID);

        incentiveRewardHistory.amount = ZERO_BD;
        incentiveRewardHistory.timestamp = event.block.timestamp;
        incentiveRewardHistory.user = user.id;
        incentiveRewardHistory.times = ZERO_BI;
    }
    incentiveRewardHistory.times = incentiveRewardHistory.times.plus(ONE_BI);
    incentiveRewardHistory.amount = incentiveRewardHistory.amount.plus(amount);

    let tradingIncentive = TradingIncentive.load(dataSource.address().toHexString());
    if (tradingIncentive == null) {
        tradingIncentive = new TradingIncentive(dataSource.address().toHexString())
        tradingIncentive.totalUser = ONE_BI;
        tradingIncentive.totalAmount = amount;
    } else {
        if (user.tradingRewardRecieved.equals(ZERO_BD)) {
            tradingIncentive.totalUser = tradingIncentive.totalUser.plus(ONE_BI);
        }
        tradingIncentive.totalAmount = tradingIncentive.totalAmount.plus(amount);
    }

    incentiveRewardHistory.totalAmount = tradingIncentive.totalAmount;
    incentiveRewardHistory.totalUser = tradingIncentive.totalUser;
    user.tradingRewardRecieved = user.tradingRewardRecieved.plus(amount);

    //更新时间戳
    tradingIncentive.updatedAt = event.block.timestamp;
    incentiveRewardHistory.updatedAt = event.block.timestamp;
    user.updatedAt = event.block.timestamp;

    tradingIncentive.save();
    incentiveRewardHistory.save();
    user.save();
}
