import {ERC20MineV3, ERC20MineV3__rewardTokenInfosResult} from "../../types/dodomine/DODOMineV3Proxy/ERC20MineV3"
import {Address, BigInt} from "@graphprotocol/graph-ts"

export function getRewardNum(address: Address): BigInt {
    let contract = ERC20MineV3.bind(address);
    let num = contract.getRewardNum();
    return num;
}

export function rewardTokenInfos(address: Address, index: BigInt): ERC20MineV3__rewardTokenInfosResult {
    let contract = ERC20MineV3.bind(address);
    let rewardTokenInfosResult = contract.rewardTokenInfos(index);
    return rewardTokenInfosResult as ERC20MineV3__rewardTokenInfosResult;
}

export function getIdByRewardToken(address: Address, token: Address): BigInt {
    let contract = ERC20MineV3.bind(address);
    let ID = contract.getIdByRewardToken(token);
    return ID;
}

export function getToken(address: Address): Address {
    let contract = ERC20MineV3.bind(address);
    let token = contract._TOKEN_();
    return token;
}
