import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token,Pair} from "../types/schema"
import {OrderHistory as OrderHistoryV1} from "../types/DODOV1Proxy01/DODOV1Proxy01"
import {createToken,createLpToken, createUser, ZERO_BI, ZERO_BD, ONE_BI, convertTokenToDecimal,TYPE_DPP_POOL,TYPE_DVM_POOL} from "./helpers"
import { NewDPP } from "../types/DPPFactory/DPPFactory"
import { NewDVM } from "../types/DVMFactory/DVMFactory"
import {DVM,DVM__getPMMStateResultStateStruct} from "../types/DVMFactory/DVM"
import {DPP,DPP__getPMMStateResultStateStruct} from "../types/DPPFactory/DPP"
import {DVM as DVMTemplate,DPP as DPPTemplate} from "../types/templates"

export function handleNewDVM(event: NewDVM): void {
    //1、获取token schema信息
    let baseToken = createToken(event.params.baseToken);
    let quoteToken = createToken(event.params.quoteToken);
    let pair = Pair.load(event.params.dvm.toHexString());

    if(pair == null){
        pair = new Pair(event.params.dvm.toHexString());
        pair.baseToken=event.params.baseToken.toHexString();
        pair.type = TYPE_DVM_POOL;

        pair.quoteToken = event.params.quoteToken.toHexString();
        pair.creator = event.params.creator;
        pair.createdAtTimestamp = event.block.timestamp;
        pair.createdAtBlockNumber = event.block.number;

        pair.baseLpToken = event.params.dvm.toHexString();
        pair.quoteLpToken = event.params.dvm.toHexString();
        createLpToken(event.params.dvm);

        pair.txCount = ZERO_BI;
        pair.volumeBaseToken = ZERO_BD;
        pair.volumeQuoteToken = ZERO_BD;
        pair.amountUSDC = ZERO_BD;
        pair.liquidityProviderCount = ZERO_BI;

        let dvm = DVM.bind(event.params.dvm);
        let pmmState = dvm.getPMMState();
        pair.i =pmmState.i;
        pair.k = pmmState.K;
        pair.baseReserve = convertTokenToDecimal(pmmState.B,baseToken.decimals);
        pair.quoteReserve = convertTokenToDecimal(pmmState.Q,quoteToken.decimals);

        pair.save()
    }

    DVMTemplate.create(event.params.dvm);

}

export function handleNewDPP(event: NewDPP): void {
    //1、获取token schema信息
    let baseToken = createToken(event.params.baseToken);
    let quoteToken = createToken(event.params.quoteToken);

    let pair = Pair.load(event.params.dpp.toHexString());

    if(pair == null){
        pair = new Pair(event.params.dpp.toHexString());
        pair.baseToken=event.params.baseToken.toHexString();
        pair.type = TYPE_DPP_POOL;

        pair.quoteToken = event.params.quoteToken.toHexString();
        pair.creator = event.params.creator;
        pair.createdAtTimestamp = event.block.timestamp;
        pair.createdAtBlockNumber = event.block.number;

        pair.txCount = ZERO_BI;
        pair.volumeBaseToken = ZERO_BD;
        pair.volumeQuoteToken = ZERO_BD;
        pair.amountUSDC = ZERO_BD;
        pair.liquidityProviderCount = ZERO_BI;

        let dvm = DPP.bind(event.params.dpp);
        let pmmState = dvm.getPMMState();
        pair.i =pmmState.i;
        pair.k = pmmState.K;
        pair.baseReserve = convertTokenToDecimal(pmmState.B,baseToken.decimals);
        pair.quoteReserve = convertTokenToDecimal(pmmState.Q,quoteToken.decimals);

        pair.save()
    }

    DPPTemplate.create(event.params.dpp);

}
