import {PairDayData, TokenDayData, CrowdPoolingDayData, CrowdPooling, Token, Pair, LpToken} from "../types/schema"
import {BigInt, BigDecimal, ethereum, log} from '@graphprotocol/graph-ts'
import {ONE_BI, ZERO_BD, ZERO_BI, convertTokenToDecimal, TYPE_DPP_POOL, TYPE_DVM_POOL} from './helpers'

export function updatePairDayData(event: ethereum.Event): PairDayData {
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;

    let dayPairID = event.address.toHexString().concat("-").concat(BigInt.fromI32(dayID).toString())

    let pair = Pair.load(event.address.toHexString());

    let pairDayData = PairDayData.load(dayPairID);
    if (pairDayData == null) {
        pairDayData = new PairDayData(dayPairID);
        pairDayData.date = dayStartTimestamp;
        pairDayData.baseToken = pair.baseToken;
        pairDayData.quoteToken = pair.quoteToken;
        pairDayData.pairAddress = event.address;

        pairDayData.dailyVolumeQuote = ZERO_BD;
        pairDayData.dailyVolumeBase = ZERO_BD;
        pairDayData.dailyTxns = ZERO_BI;
        pairDayData.quoteTokenReserve = ZERO_BD;
        pairDayData.baseTokenReserve = ZERO_BD;
        pairDayData.baseLpTokenTotalSupply = ZERO_BD;
        pairDayData.quoteLpTokenTotalSupply = ZERO_BD;
        pairDayData.dailyVolumeUSDC = ZERO_BD;
        pairDayData.reserveUSDC = ZERO_BD;
        pairDayData.fee = ZERO_BD;
    }

    pairDayData.baseTokenReserve = pair.baseReserve;
    pairDayData.quoteTokenReserve = pair.quoteReserve;
    pairDayData.reserveUSDC = pairDayData.reserveUSDC;
    if (pair.type != TYPE_DPP_POOL) {
        let baseLpToken = LpToken.load(pair.baseLpToken);
        let quoteLpToken = LpToken.load(pair.quoteLpToken);

        pairDayData.baseLpTokenTotalSupply = convertTokenToDecimal(baseLpToken.totalSupply, baseLpToken.decimals);
        pairDayData.quoteLpTokenTotalSupply = convertTokenToDecimal(quoteLpToken.totalSupply, quoteLpToken.decimals);

    }
    pairDayData.dailyTxns = pairDayData.dailyTxns.plus(ONE_BI);
    pairDayData.save();
    return pairDayData as PairDayData;
}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;
    let tokenDayID = token.id.toString().concat("-").concat(BigInt.fromI32(dayID).toString());

    let tokenDayData = TokenDayData.load(tokenDayID);
    if (tokenDayData == null) {
        tokenDayData = new TokenDayData(tokenDayID);
        tokenDayData.date = dayStartTimestamp;
        tokenDayData.token = token.id;
        tokenDayData.priceUSDC = ZERO_BD;
        tokenDayData.dailyVolumeToken = ZERO_BD;
        tokenDayData.dailyTxns = ZERO_BI;
        tokenDayData.totalLiquidityToken = ZERO_BD;
        tokenDayData.dailyVolumeUSDC = ZERO_BD;
        tokenDayData.totalLiquidityUSDC = ZERO_BD;
        tokenDayData.fee = ZERO_BD;
    }

    tokenDayData.priceUSDC = token.priceUSDC;
    tokenDayData.totalLiquidityToken = token.totalLiquidityOnDODO;
    tokenDayData.totalLiquidityUSDC = token.totalLiquidityOnDODO.times(token.priceUSDC);
    tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
    tokenDayData.save();

    return tokenDayData as TokenDayData;

}

export function updateCrowdPoolingDayData(cp: CrowdPooling,event: ethereum.Event): CrowdPoolingDayData{

    let timestamp = event.block.timestamp.toI32();
    let dayID = timestamp / 86400;
    let dayStartTimestamp = dayID * 86400;
    let cpDayDataID = cp.id.toString().concat("-").concat(BigInt.fromI32(dayID).toString());

    let cpDayData = CrowdPoolingDayData.load(cpDayDataID);
    if(cpDayData == null){
        cpDayData = new CrowdPoolingDayData(cpDayDataID);
        cpDayData.date = dayStartTimestamp;
        cpDayData.investCount = ZERO_BI;
        cpDayData.investedQuote = ZERO_BD;
        cpDayData.canceledQuote = ZERO_BD;
        cpDayData.newcome=ZERO_BI;
        cpDayData.crowdPooling = cp.id;
        cpDayData.poolQuote = cp.poolQuote;
        cpDayData.save();
    }
    return cpDayData as CrowdPoolingDayData;

}
