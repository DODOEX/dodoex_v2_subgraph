import {MinePool, RewardDetail} from "../../types/mine/schema"
import {CreateMineV3} from "../../types/mine/DODOMineV3Proxy/DODOMineV3Proxy"
import {CreateMineV3 as V2CreateMineV3} from "../../types/mine/DODOMineV3Proxy/DODOMineV3ProxyV2"
import {ERC20MineV3 as ERC20MineV3Template} from "../../types/mine/templates"

import {getRewardNum, rewardTokenInfos, getToken} from "./helper"
import {BigInt, log} from "@graphprotocol/graph-ts";

export function handleCreateMineV3(event: CreateMineV3): void {
    let minePool = MinePool.load(event.params.mineV3.toHexString());

    if (minePool == null) {
        minePool = new MinePool(event.params.mineV3.toHexString());
    }
    minePool.creator = event.params.account;
    minePool.pool = event.params.mineV3;
    minePool.timestamp = event.block.timestamp;
    minePool.stakeToken = getToken(event.params.mineV3);

    let rewardTokensNum = getRewardNum(event.params.mineV3);

    for (let i = 0; i < rewardTokensNum.toI32(); i++) {
        let rewardData = rewardTokenInfos(event.params.mineV3, BigInt.fromI32(i));
        let detailID = event.params.mineV3.toHexString().concat("-").concat(rewardData.value0.toHexString());
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

    //will get "fatalError":{"message":"type mismatch with parameters: expected 1 types, found 0"
    log.debug("mineV3 address: {}", [event.params.mineV3.toHexString()]);
    log.info("mineV3 address: {}", [event.params.mineV3.toHexString()]);
    if (event.params.mineV3 != null) {
        ERC20MineV3Template.create(event.params.mineV3);
    }
}

export function handleV2CreateMineV3(event: V2CreateMineV3): void {
    let minePool = MinePool.load(event.params.mineV3.toHexString());

    if (minePool == null) {
        minePool = new MinePool(event.params.mineV3.toHexString());
    }
    minePool.creator = event.params.account;
    minePool.pool = event.params.mineV3;
    minePool.timestamp = event.block.timestamp;
    minePool.platform = event.params.platform;
    minePool.stakeToken = getToken(event.params.mineV3);

    let rewardTokensNum = getRewardNum(event.params.mineV3);

    for (let i = 0; i < rewardTokensNum.toI32(); i++) {
        let rewardData = rewardTokenInfos(event.params.mineV3, BigInt.fromI32(i));
        let detailID = event.params.mineV3.toHexString().concat("-").concat(rewardData.value0.toHexString());
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

    //will get "fatalError":{"message":"type mismatch with parameters: expected 1 types, found 0"
    log.debug("mineV3 address: {}", [event.params.mineV3.toHexString()]);
    log.info("mineV3 address: {}", [event.params.mineV3.toHexString()]);
    if (event.params.mineV3 != null) {
        ERC20MineV3Template.create(event.params.mineV3);
    }
}