import {Address, BigDecimal, BigInt, dataSource, ethereum} from "@graphprotocol/graph-ts/index";
import {ADDRESS_ZERO, DODOZooID, TYPE_CLASSICAL_POOL} from "../constant";
import {createLpToken, createToken, getDODOZoo, ONE_BI, ZERO_BD, ZERO_BI,fetchPoolFeeRate} from "./helpers";
import {Pair} from "../../types/dodoex/schema";
import {DODO as DODOTemplate, DODOLpToken as DODOLpTokenTemplate} from "../../types/dodoex/templates";

const POOLS_ADDRESS: string[] = [
    "0x6790424249cad1bce244b55afbb240703f5265f6",//USDT-USDC
]

const BASE_TOKENS: string[] = [
    "0x4988a896b1227218e4a686fde5eabdcabd91571f",//USDT
]

const QUOTE_TOKENS: string[] = [
    "0xb12bfca5a55806aaf64e99521918a4bf0fc40802",//USDC
]

const BASE_LP_TOKENS: string[] = [
    "0xb279e0740a022f5678565d699fa8ff0bb6d7f95b",//
]

const QUOTE_LP_TOKENS: string[] = [
    "0xb96947abfb0001aa0860787086dabc97fc8ac468",
]

const OWNER: string[] = [
    "0x16cc37d06fe5061cd0023fb8d142abaabb396a2b",
]

const createTime: number[] = [
    1603911960
]

export function insertAllPairs4V1Aurora(event: ethereum.Event): void {
    const network = dataSource.network();
    if (network != "aurora") {
        return;
    }

    let dodoZoo = getDODOZoo();

    for (let i = 0; i < POOLS_ADDRESS.length; i++) {

        if (Pair.load(POOLS_ADDRESS[i].toString()) == null) {
            //tokens
            let baseToken = createToken(Address.fromString(BASE_TOKENS[i]), event);
            let quoteToken = createToken(Address.fromString(QUOTE_TOKENS[i]), event);

            let pair = new Pair(POOLS_ADDRESS[i].toString()) as Pair

            pair.baseToken = baseToken.id;
            pair.quoteToken = quoteToken.id;
            pair.baseSymbol = baseToken.symbol;
            pair.quoteSymbol = quoteToken.symbol;
            pair.type = TYPE_CLASSICAL_POOL;

            pair.creator = Address.fromString(OWNER[i]);
            pair.createdAtTimestamp = BigInt.fromI32(createTime[i]);
            pair.createdAtBlockNumber = event.block.number;

            let baseLpToken = createLpToken(Address.fromString(BASE_LP_TOKENS[i]), pair);
            let quoteLpToken = createLpToken(Address.fromString(QUOTE_LP_TOKENS[i]), pair);

            pair.lastTradePrice = ZERO_BD;
            pair.baseLpToken = baseLpToken.id;
            pair.quoteLpToken = quoteLpToken.id;
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
            pair.volumeUSD = ZERO_BD;
            pair.feeUSD = ZERO_BD;

            pair.i = ZERO_BI;
            pair.k = ZERO_BI;
            pair.baseReserve = ZERO_BD;
            pair.quoteReserve = ZERO_BD;

            pair.lpFeeRate = BigDecimal.fromString("0");

            pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
            pair.maintainer = Address.fromString(ADDRESS_ZERO);
            pair.mtFeeRate = ZERO_BI;
            pair.mtFeeBase = ZERO_BD;
            pair.mtFeeQuote = ZERO_BD;
            pair.mtFeeUSD = ZERO_BD;
            pair.updatedAt = event.block.timestamp;

            baseToken.save();
            quoteToken.save();
            baseLpToken.save();
            quoteLpToken.save();
            pair.save();

            dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
            DODOTemplate.create(Address.fromString(POOLS_ADDRESS[i]));

            DODOLpTokenTemplate.create(Address.fromString(BASE_LP_TOKENS[i]));
            DODOLpTokenTemplate.create(Address.fromString(QUOTE_LP_TOKENS[i]));
        }

    }

    dodoZoo.save();

}