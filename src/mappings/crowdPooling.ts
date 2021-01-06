import {PairDayData, TokenDayData,Token, Pair, LpToken} from "../types/schema"
import {BigInt, BigDecimal, ethereum,log} from '@graphprotocol/graph-ts'
import {ONE_BI, ZERO_BD, ZERO_BI, convertTokenToDecimal,TYPE_DPP_POOL,TYPE_DVM_POOL} from './helpers'
import {Bid,Cancel} from "../types/templates/CP/CP"

export function handleBid(evnet: Bid): void {

}

export function handleCancel(event: Cancel): void {

}
