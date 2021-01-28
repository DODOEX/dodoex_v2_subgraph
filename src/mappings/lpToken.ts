import {Transfer} from "../types/templates/DVM/DVM";
import {LiquidityPosition, LpToken, Pair} from "../types/schema";
import {convertTokenToDecimal, createUser, ZERO_BD, ZERO_BI} from "./helpers";
import {ADDRESS_ZERO} from "./constant";
import {log, BigInt, BigDecimal, Address, ethereum,dataSource} from '@graphprotocol/graph-ts'

//lptoken handler for classical
export function handleTransfer(event: Transfer): void{
    if (event.params.to.toHexString() == ADDRESS_ZERO || event.params.from.toHexString() == ADDRESS_ZERO) {
        return;
    }
    let fromUser = createUser(event.params.from);
    let toUser = createUser(event.params.to);
    let lpToken = LpToken.load(event.address.toHexString());
    let dealedAmount = convertTokenToDecimal(event.params.amount, lpToken.decimals);

    {
        let toUserLiquidityPositionID = toUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(toUserLiquidityPositionID);
        if (position == null) {
            position = new LiquidityPosition(toUserLiquidityPositionID);
            position.pair = lpToken.pair;
            position.user = event.params.to.toHexString();
            position.liquidityTokenBalance = ZERO_BD;
            position.lpToken = lpToken.id;
            position.lastTxTime = ZERO_BI;
            position.liquidityTokenInMining = ZERO_BD;
        }
        position.liquidityTokenBalance = position.liquidityTokenBalance.plus(dealedAmount);
        position.save();
    }

    {
        let fromUserLiquidityPositionID = fromUser.id.concat("-").concat(lpToken.id);
        let position = LiquidityPosition.load(fromUserLiquidityPositionID);
        if (position == null) {
            position = new LiquidityPosition(fromUserLiquidityPositionID);
            position.pair = lpToken.pair;
            position.user = event.params.to.toHexString();
            position.liquidityTokenBalance = ZERO_BD;
            position.lpToken = lpToken.id;
            position.lastTxTime = ZERO_BI;
            position.liquidityTokenInMining = ZERO_BD;
        }
        position.liquidityTokenBalance = position.liquidityTokenBalance.minus(dealedAmount);
        position.save();
    }

}
