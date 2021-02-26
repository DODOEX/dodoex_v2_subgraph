import {BigInt, BigDecimal, ethereum, log, Address} from '@graphprotocol/graph-ts'
import {OrderHistory, Token, Pair, CrowdPooling} from "../../types/dodoex/schema"
import {
    createToken,
    createLpToken,
    createUser,
    ZERO_BI,
    ZERO_BD,
    ONE_BI,
    convertTokenToDecimal,
    getDODOZoo
} from "./helpers"
import {NewDPP} from "../../types/dodoex/DPPFactory/DPPFactory"
import {NewDVM} from "../../types/dodoex/DVMFactory/DVMFactory"
import {DVM, DVM__getPMMStateResultStateStruct} from "../../types/dodoex/DVMFactory/DVM"
import {DPP, DPP__getPMMStateResultStateStruct} from "../../types/dodoex/DPPFactory/DPP"
import {NewCP} from "../../types/dodoex/CrowdPoolingFactory/CrowdPoolingFactory"
import {DVM as DVMTemplate, DPP as DPPTemplate, CP as CPTemplate} from "../../types/dodoex/templates"
import {TYPE_DVM_POOL,TYPE_DPP_POOL,TYPE_CLASSICAL_POOL,SOURCE_SMART_ROUTE,SOURCE_POOL_SWAP} from "../constant"
import {CP} from "../../types/dodoex/CrowdPoolingFactory/CP";
import {ADDRESS_ZERO} from "../constant"

export function handleNewDVM(event: NewDVM): void {
    createUser(event.params.creator,event);
    //1、获取token schema信息
    let baseToken = createToken(event.params.baseToken,event);
    let quoteToken = createToken(event.params.quoteToken,event);
    let pair = Pair.load(event.params.dvm.toHexString());

    if (pair == null) {
        pair = new Pair(event.params.dvm.toHexString());
        pair.baseToken = event.params.baseToken.toHexString();
        pair.type = TYPE_DVM_POOL;

        pair.quoteToken = event.params.quoteToken.toHexString();
        pair.creator = event.params.creator;
        pair.createdAtTimestamp = event.block.timestamp;
        pair.createdAtBlockNumber = event.block.number;

        pair.baseLpToken = event.params.dvm.toHexString();
        pair.quoteLpToken = event.params.dvm.toHexString();
        createLpToken(event.params.dvm,pair as Pair);

        pair.txCount = ZERO_BI;
        pair.volumeBaseToken = ZERO_BD;
        pair.volumeQuoteToken = ZERO_BD;
        pair.liquidityProviderCount = ZERO_BI;
        pair.untrackedBaseVolume = ZERO_BD;
        pair.untrackedQuoteVolume = ZERO_BD;
        pair.feeBase = ZERO_BD;
        pair.feeQuote = ZERO_BD;
        pair.traderCount = ZERO_BI;
        pair.isTradeAllowed = true;
        pair.isDepositBaseAllowed = true;
        pair.isDepositQuoteAllowed = true;

        let dvm = DVM.bind(event.params.dvm);
        let pmmState = dvm.try_getPMMState();
        if(pmmState.reverted==false){
            pair.i = pmmState.value.i;
            pair.k = pmmState.value.K;
            pair.baseReserve = convertTokenToDecimal(pmmState.value.B, baseToken.decimals);
            pair.quoteReserve = convertTokenToDecimal(pmmState.value.Q, quoteToken.decimals);
            pair.lpFeeRate = convertTokenToDecimal(dvm._LP_FEE_RATE_(),BigInt.fromI32(18));
            pair.mtFeeRateModel = dvm._MT_FEE_RATE_MODEL_();
            pair.maintainer = dvm._MAINTAINER_();
        }else{
            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;
            pair.lpFeeRate = ZERO_BD;
            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);
        }

        pair.save()

        let dodoZoo = getDODOZoo();
        dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
        dodoZoo.save()
    }

    DVMTemplate.create(event.params.dvm);

}

export function handleNewDPP(event: NewDPP): void {
    createUser(event.params.creator,event);
    //1、获取token schema信息
    let baseToken = createToken(event.params.baseToken,event);
    let quoteToken = createToken(event.params.quoteToken,event);

    let pair = Pair.load(event.params.dpp.toHexString());

    if (pair == null) {
        pair = new Pair(event.params.dpp.toHexString());
        pair.baseToken = event.params.baseToken.toHexString();
        pair.type = TYPE_DPP_POOL;

        pair.quoteToken = event.params.quoteToken.toHexString();
        pair.creator = event.params.creator;
        pair.createdAtTimestamp = event.block.timestamp;
        pair.createdAtBlockNumber = event.block.number;

        pair.txCount = ZERO_BI;
        pair.volumeBaseToken = ZERO_BD;
        pair.volumeQuoteToken = ZERO_BD;
        pair.liquidityProviderCount = ZERO_BI;
        pair.untrackedBaseVolume = ZERO_BD;
        pair.untrackedQuoteVolume = ZERO_BD;
        pair.feeBase = ZERO_BD;
        pair.feeQuote = ZERO_BD;
        pair.traderCount = ZERO_BI;
        pair.isTradeAllowed = true;
        pair.isDepositBaseAllowed = false;
        pair.isDepositQuoteAllowed = false;

        let dpp = DPP.bind(event.params.dpp);
        let pmmState = dpp.try_getPMMState();
        if(pmmState.reverted==false){
            pair.i = pmmState.value.i;
            pair.k = pmmState.value.K;
            pair.baseReserve = convertTokenToDecimal(pmmState.value.B, baseToken.decimals);
            pair.quoteReserve = convertTokenToDecimal(pmmState.value.Q, quoteToken.decimals);
            pair.lpFeeRate = convertTokenToDecimal(dpp._LP_FEE_RATE_(),BigInt.fromI32(18));
            pair.mtFeeRateModel = dpp._MT_FEE_RATE_MODEL_();
            pair.maintainer = dpp._MAINTAINER_();
        }else{
            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;
            pair.lpFeeRate = ZERO_BD;
            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);
        }

        pair.save();

        let dodoZoo = getDODOZoo();
        dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
        dodoZoo.save()
    }

    DPPTemplate.create(event.params.dpp);

}

export function handleNewCP(event: NewCP): void {
    createUser(event.params.creator,event);
    //1、检查token情况
    let baseToken = createToken(event.params.baseToken,event);
    let quoteToken = createToken(event.params.quoteToken,event);

    let crowdPooling = CrowdPooling.load(event.params.cp.toHexString());
    if (crowdPooling == null) {
        crowdPooling = new CrowdPooling(event.params.cp.toHexString());
        crowdPooling.creator = event.params.creator;
        crowdPooling.createTime = event.block.timestamp;
        crowdPooling.totalShares = ZERO_BD;
        let cp = CP.bind(event.params.cp);
        crowdPooling.creator = event.params.creator;
        crowdPooling.baseToken = event.params.baseToken.toHexString();
        crowdPooling.quoteToken = event.params.quoteToken.toHexString();
        crowdPooling.bidStartTime = cp._PHASE_BID_STARTTIME_();
        crowdPooling.bidEndTime = cp._PHASE_BID_ENDTIME_();
        crowdPooling.calmEndTime = cp._PHASE_CALM_ENDTIME_();
        crowdPooling.freezeDuration = cp._FREEZE_DURATION_();
        crowdPooling.vestingDuration = cp._VESTING_DURATION_();
        crowdPooling.i = cp._I_();
        crowdPooling.k = cp._K_();
        crowdPooling.mtFeeRateModel = cp._MT_FEE_RATE_MODEL_();

        crowdPooling.investorsCount = ZERO_BI;
        crowdPooling.totalBase = convertTokenToDecimal(cp._TOTAL_BASE_(),baseToken.decimals);
        crowdPooling.poolQuoteCap = convertTokenToDecimal(cp._POOL_QUOTE_CAP_(),quoteToken.decimals);
        crowdPooling.poolQuote = ZERO_BD;
        crowdPooling.settled = false;
        crowdPooling.dvm = ADDRESS_ZERO;
        crowdPooling.liquidator = Address.fromString(ADDRESS_ZERO);

        let dodoZoo = getDODOZoo();
        dodoZoo.crowdpoolingCount = dodoZoo.crowdpoolingCount.plus(ONE_BI);

        crowdPooling.serialNumber =dodoZoo.crowdpoolingCount;

        crowdPooling.save();
        dodoZoo.save();
    }

    CPTemplate.create(event.params.cp);

}
