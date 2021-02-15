import {Transfer} from "../../types/token/ERC20Factory/ERC20"
import {
    createUser,
    ONE_BI,
    ZERO_BD,
    convertTokenToDecimal
} from "./helpers"
import {Token,UserTokenBlance,TransferHistory} from "../../types/token/schema"
import {dataSource} from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
    let token = Token.load(dataSource.address().toHexString());

    if (token == null) return;

    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);

    let fromUserTokenBalance = UserTokenBlance.load(fromUser.id.concat("-").concat(dataSource.address().toHexString()))
    let toUserTokenBalance = UserTokenBlance.load(toUser.id.concat("-").concat(dataSource.address().toHexString()))
    if(fromUserTokenBalance==null){
        fromUserTokenBalance = new UserTokenBlance(fromUser.id.concat("-").concat(dataSource.address().toHexString()));
        fromUserTokenBalance.balance=ZERO_BD;
    }
    if(toUserTokenBalance==null){
        toUserTokenBalance = new UserTokenBlance(toUser.id.concat("-").concat(dataSource.address().toHexString()));
        toUserTokenBalance.balance=ZERO_BD;
    }

    let dealedAmount = convertTokenToDecimal(event.params.value, token.decimals);

    fromUserTokenBalance.balance = fromUserTokenBalance.balance.minus(dealedAmount);
    toUserTokenBalance.balance = toUserTokenBalance.balance.plus(dealedAmount);

    if(dealedAmount.gt(ZERO_BD)&&fromUserTokenBalance.balance.equals(ZERO_BD)){
        token.holderCount = token.holderCount.minus(ONE_BI);
    }
    if(toUserTokenBalance.balance.equals(dealedAmount)){
        token.holderCount = token.holderCount.plus(ONE_BI);
    }

    let transferHistory = TransferHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if(transferHistory==null){
        transferHistory = new TransferHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        transferHistory.from = fromUser.id;
        transferHistory.to = toUser.id;
        transferHistory.amount = dealedAmount;
    }

    fromUser.save();
    toUser.save();
    fromUserTokenBalance.save();
    toUserTokenBalance.save();
    token.save();
    transferHistory.save();
}