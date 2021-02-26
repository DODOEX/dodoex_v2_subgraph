import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import { ZERO_BD, convertTokenToDecimal, createPool} from "./helpers"
import {Deposit, Withdraw, Claim} from "../../types/dodoex/DODOMine/DODOMine"
import {LiquidityPosition, LpToken} from "../../types/dodoex/schema"

export function handleDeposit(event: Deposit): void {

    let pool = createPool(event.params.pid);
    let lpToken = LpToken.load(pool.lpToken);
    if(lpToken == null){return}

    let dealedAmount = convertTokenToDecimal(event.params.amount,lpToken.decimals);

    let liquidityPositionID = event.params.user.toHexString().concat("-").concat(lpToken.id);
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = lpToken.pair;
        liquidityPosition.user = event.params.user.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.lastTxTime = event.block.timestamp;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    }
    liquidityPosition.liquidityTokenInMining = liquidityPosition.liquidityTokenInMining.plus(dealedAmount);
    liquidityPosition.save();

    pool.staked = pool.staked.plus(dealedAmount);
    pool.save();
}

export function handleWithdraw(event: Withdraw): void {

    let pool = createPool(event.params.pid);
    let lpToken = LpToken.load(pool.lpToken);
    if(lpToken == null){return}

    let dealedAmount = convertTokenToDecimal(event.params.amount,lpToken.decimals);

    let liquidityPositionID = event.params.user.toHexString().concat("-").concat(lpToken.id);
    let liquidityPosition = LiquidityPosition.load(liquidityPositionID);
    if (liquidityPosition == null) {
        liquidityPosition = new LiquidityPosition(liquidityPositionID);
        liquidityPosition.pair = lpToken.pair;
        liquidityPosition.user = event.params.user.toHexString();
        liquidityPosition.liquidityTokenBalance = ZERO_BD;
        liquidityPosition.lpToken = lpToken.id;
        liquidityPosition.lastTxTime = event.block.timestamp;
        liquidityPosition.liquidityTokenInMining = ZERO_BD;
    }
    liquidityPosition.liquidityTokenInMining = liquidityPosition.liquidityTokenInMining.minus(dealedAmount);
    liquidityPosition.save();

    pool.staked = pool.staked.minus(dealedAmount);
    pool.save();
}

export function handleClaim(event: Claim): void {

}
