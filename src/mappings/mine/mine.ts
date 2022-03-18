import {Address, BigInt} from "@graphprotocol/graph-ts"
import {Deposit, Withdraw, NewRewardToken} from "../../types/mine/templates/ERC20MineV3/ERC20MineV3"
import {MinePool, RewardDetail, UserStake} from "../../types/mine/schema"
import {getRewardNum, rewardTokenInfos} from "./helper";

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
    userStake.updatedAt = event.block.timestamp;
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
    userStake.updatedAt = event.block.timestamp;
    userStake.save();
}

export function handleNewRewardToken(event: NewRewardToken): void {
    let minePool = MinePool.load(event.address.toHexString());
    let rewardTokensNum = getRewardNum(event.address);

    for (let i = 0; i < rewardTokensNum.toI32(); i++) {
        let rewardData = rewardTokenInfos(event.address, BigInt.fromI32(i));
        let detailID = event.address.toHexString().concat("-").concat(rewardData.value0.toHexString());
        let rewardDetail = RewardDetail.load(detailID);

        if (rewardDetail == null) {
            rewardDetail = new RewardDetail(detailID);
        }
        rewardDetail.minePool = minePool.id;
        rewardDetail.token = rewardData.value0;
        rewardDetail.startBlock = rewardData.value1;
        rewardDetail.endBlock = rewardData.value2;
        rewardDetail.rewardPerBlock = rewardData.value4;
        rewardDetail.updatedAt = event.block.timestamp;
        rewardDetail.save();
    }

    minePool.updatedAt = event.block.timestamp;
    minePool.save();
}

export function handleUpdateEndBlock(event: NewRewardToken): void {
    let minePool = MinePool.load(event.address.toHexString());
    let rewardTokensNum = getRewardNum(event.address);

    for (let i = 0; i < rewardTokensNum.toI32(); i++) {
        let rewardData = rewardTokenInfos(event.address, BigInt.fromI32(i));
        let detailID = event.address.toHexString().concat("-").concat(rewardData.value0.toHexString());
        let rewardDetail = RewardDetail.load(detailID);

        if (rewardDetail == null) {
            rewardDetail = new RewardDetail(detailID);
        }
        rewardDetail.minePool = minePool.id;
        rewardDetail.token = rewardData.value0;
        rewardDetail.startBlock = rewardData.value1;
        rewardDetail.endBlock = rewardData.value2;
        rewardDetail.rewardPerBlock = rewardData.value4;
        rewardDetail.updatedAt = event.block.timestamp;
        rewardDetail.save();
    }

    minePool.updatedAt = event.block.timestamp;
    minePool.save();
}

export function handleUpdateReward(event: NewRewardToken): void {
    let minePool = MinePool.load(event.address.toHexString());
    let rewardTokensNum = getRewardNum(event.address);

    for (let i = 0; i < rewardTokensNum.toI32(); i++) {
        let rewardData = rewardTokenInfos(event.address, BigInt.fromI32(i));
        let detailID = event.address.toHexString().concat("-").concat(rewardData.value0.toHexString());
        let rewardDetail = RewardDetail.load(detailID);

        if (rewardDetail == null) {
            rewardDetail = new RewardDetail(detailID);
        }
        rewardDetail.minePool = minePool.id;
        rewardDetail.token = rewardData.value0;
        rewardDetail.startBlock = rewardData.value1;
        rewardDetail.endBlock = rewardData.value2;
        rewardDetail.rewardPerBlock = rewardData.value4;
        rewardDetail.updatedAt = event.block.timestamp;
        rewardDetail.save();
    }

    minePool.updatedAt = event.block.timestamp;
    minePool.save();
}