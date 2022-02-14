import {DepositHistory, ClaimHistory, WithdrawFundHistory,Starter} from "../../types/starter/schema"
import {DepositFund,ClaimToken,WithdrawFund} from "../../types/starter/templates/FairFunding/FairFunding"
import {ZERO_BI} from "../utils/helper";

export function handleDepositHistory(event: DepositFund): void {
    let starter = Starter.load(event.address.toHexString());

    if(starter ==null){
        return
    }

    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toHexString());
    let depositHistory = DepositHistory.load(id);
    if(depositHistory==null){
        depositHistory = new DepositHistory(id);
        depositHistory.hash = event.transaction.hash.toHexString();
        depositHistory.starter = starter.id;
        depositHistory.user = event.params.account;
        depositHistory.amount  = event.params.fundAmount;
        depositHistory.allocationAmount  = ZERO_BI;
        depositHistory.timestamp = event.block.timestamp;
        depositHistory.updatedAt = event.block.timestamp;
        depositHistory.save();
    }
}

export function handleClaimHistory(event: ClaimToken): void {
    let starter = Starter.load(event.address.toHexString());

    if(starter ==null){
        return
    }

    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toHexString());
    let claimHistory = ClaimHistory.load(id);
    if(claimHistory==null){
        claimHistory = new ClaimHistory(id);
        claimHistory.hash = event.transaction.hash.toHexString();
        claimHistory.starter = starter.id;
        claimHistory.user = event.params.to;
        claimHistory.tokenAmount = event.params.tokenAmount;
        claimHistory.fundAmount = event.params.fundAmount;
        claimHistory.starter
        claimHistory.timestamp = event.block.timestamp;
        claimHistory.updatedAt = event.block.timestamp;
        claimHistory.save();
    }
}

export function handleWithdrawFund(event: WithdrawFund): void {
    let starter = Starter.load(event.address.toHexString());

    if(starter ==null){
        return
    }

    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toHexString());
    let withdrawFundHistory = WithdrawFundHistory.load(id);
    if(withdrawFundHistory==null){
        withdrawFundHistory = new WithdrawFundHistory(id);
        withdrawFundHistory.hash = event.transaction.hash.toHexString();
        withdrawFundHistory.starter = starter.id;
        withdrawFundHistory.user = event.params.to;
        withdrawFundHistory.fundAmount = event.params.fundAmount;
        withdrawFundHistory.starter
        withdrawFundHistory.timestamp = event.block.timestamp;
        withdrawFundHistory.updatedAt = event.block.timestamp;
        withdrawFundHistory.save();
    }
}
