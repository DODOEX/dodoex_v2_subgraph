import { BigInt, Address, store } from "@graphprotocol/graph-ts";
import { Pair } from "../../types/dodoex/schema";
import {
  createToken,
  createLpToken,
  createUser,
  ZERO_BI,
  ZERO_BD,
  ONE_BI,
  convertTokenToDecimal,
  getDODOZoo,
  createPairDetail,
} from "./helpers";
import { NewGSP, RemoveGSP } from "../../types/dodoex/GSPFactory/GSPFactory";
import { GSP } from "../../types/dodoex/GSPFactory/GSP";

import { GSP as GSPTemplate } from "../../types/dodoex/templates";
import { TYPE_GSP_POOL } from "../constant";
import { ADDRESS_ZERO } from "../constant";

export function handleNewGSP(event: NewGSP): void {
  createUser(event.params.creator, event);
  //1、获取token schema信息
  let baseToken = createToken(event.params.baseToken, event);
  let quoteToken = createToken(event.params.quoteToken, event);
  let pair = Pair.load(event.params.GSP.toHexString());

  if (pair == null) {
    pair = new Pair(event.params.GSP.toHexString());
    pair.baseToken = event.params.baseToken.toHexString();
    pair.type = TYPE_GSP_POOL;
    pair.quoteToken = event.params.quoteToken.toHexString();
    pair.baseSymbol = baseToken.symbol;
    pair.quoteSymbol = quoteToken.symbol;
    pair.creator = event.params.creator;
    pair.owner = pair.creator;
    pair.createdAtTimestamp = event.block.timestamp;
    pair.createdAtBlockNumber = event.block.number;

    pair.baseLpToken = event.params.GSP.toHexString();
    pair.quoteLpToken = event.params.GSP.toHexString();
    createLpToken(event.params.GSP, pair as Pair);

    pair.lastTradePrice = ZERO_BD;
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
    pair.volumeUSD = ZERO_BD;
    pair.feeUSD = ZERO_BD;

    let gsp = GSP.bind(event.params.GSP);
    let pmmState = gsp.try_getPMMState();
    if (pmmState.reverted == false) {
      createPairDetail(pair, pmmState.value, event.block.timestamp);
      pair.i = pmmState.value.i;
      pair.k = pmmState.value.K;
      pair.baseReserve = convertTokenToDecimal(
        pmmState.value.B,
        baseToken.decimals
      );
      pair.quoteReserve = convertTokenToDecimal(
        pmmState.value.Q,
        quoteToken.decimals
      );
      pair.lpFeeRate = convertTokenToDecimal(
        gsp._LP_FEE_RATE_(),
        BigInt.fromI32(18)
      );
      let mtFeeRateModel = gsp.try__MT_FEE_RATE_MODEL_();
      if (mtFeeRateModel.reverted == false) {
        pair.mtFeeRateModel = mtFeeRateModel.value;
      } else {
        pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
      }
      pair.maintainer = gsp._MAINTAINER_();
    } else {
      pair.i = ZERO_BI;
      pair.k = ZERO_BI;
      pair.baseReserve = ZERO_BD;
      pair.quoteReserve = ZERO_BD;
      pair.lpFeeRate = ZERO_BD;
      pair.mtFeeRateModel = Address.fromString(ADDRESS_ZERO);
      pair.maintainer = Address.fromString(ADDRESS_ZERO);
    }
    pair.mtFeeRate = ZERO_BI;
    pair.mtFeeBase = ZERO_BD;
    pair.mtFeeQuote = ZERO_BD;
    pair.mtFeeUSD = ZERO_BD;
    pair.updatedAt = event.block.timestamp;

    pair.save();

    let dodoZoo = getDODOZoo();
    dodoZoo.pairCount = dodoZoo.pairCount.plus(ONE_BI);
    dodoZoo.updatedAt = event.block.timestamp;
    dodoZoo.save();
  }

  GSPTemplate.create(event.params.GSP);
}

export function handleRemoveGSP(event: RemoveGSP): void {
  store.remove("Pair", event.params.GSP.toHexString());
}
