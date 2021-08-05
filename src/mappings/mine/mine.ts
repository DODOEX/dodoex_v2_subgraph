import {Address, BigInt} from "@graphprotocol/graph-ts"
import {Deposit, Withdraw, NewRewardToken} from "../../types/dodomine/templates/ERC20MineV3/ERC20MineV3"
import {UserStake} from "../../types/dodomine/schema"

export function handleDeposit(event: Deposit): void {
    let id = event.params.user.toHexString().concat("-").concat(event.address.toHexString());
    let userStake = UserStake.load(id);
    if(userStake==null){
        userStake = new UserStake(id);
        userStake.user = event.params.user;
        userStake.pool = event.address;
        userStake.balance = BigInt.fromI32(0);
    }
    userStake.balance = userStake.balance.plus(event.params.amount);
    userStake.save();
}

export function handleWithdraw(event: Withdraw): void {
    let id = event.params.user.toHexString().concat("-").concat(event.address.toHexString());
    let userStake = UserStake.load(id);
    if(userStake==null){
        userStake = new UserStake(id);
        userStake.user = event.params.user;
        userStake.pool = event.address;
        userStake.balance = BigInt.fromI32(0);
    }
    userStake.balance = userStake.balance.minus(event.params.amount);
    userStake.save();
}

export function handleNewRewardToken(event: NewRewardToken): void {

}

