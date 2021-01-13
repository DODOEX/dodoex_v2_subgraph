import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token, Pair, Swap, User, LiquidityPosition, LpToken, LiquidityHistory,IncentiveRewardHistory} from "../types/schema"
import {OrderHistory as OrderHistoryV1} from "../types/DODOV1Proxy01/DODOV1Proxy01"
import {
    createToken,
    createLpToken,
    createUser,
    ZERO_BI,
    ZERO_BD,
    BI_18,
    ONE_BI,
    convertTokenToDecimal,
    getPMMState,
    TYPE_DPP_POOL,
    TYPE_DVM_POOL
} from "./helpers"

import {Incentive} from "../types/DODOIncentive/DODOIncentive"

export function handleIncentive(event: Incentive): void {
    let user = createUser(event.params.user);
    let incentiveRewardHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let incentiveRewardHistory = IncentiveRewardHistory.load(incentiveRewardHistoryID);
    let amount = convertTokenToDecimal(event.params.reward,BI_18);

    if(incentiveRewardHistory == null){
        incentiveRewardHistory = new IncentiveRewardHistory(incentiveRewardHistoryID);
        if(user.tradingRewardRecieved.equals(ZERO_BD)){
            incentiveRewardHistory.totalUser = incentiveRewardHistory.totalUser.plus(ONE_BI);
        }

        incentiveRewardHistory.amount = amount;
        incentiveRewardHistory.timestamp = event.block.timestamp;
        incentiveRewardHistory.totalAmount = incentiveRewardHistory.totalAmount.plus(amount);
        incentiveRewardHistory.user = user.id;
    }


    user.tradingRewardRecieved = user.tradingRewardRecieved.plus(amount);

    incentiveRewardHistory.save();
    user.save();
}
