import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-eni";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = ["0xfc66a1283a43ce2f4d4fa0623d4654754577a09d"];
export const DVM_FACTORY_ADDRESS = "0x701ac6fad7850956f966a85655348ac1b7c93368";
export const DPP_FACTORY_ADDRESS = "0x297b5d923b9c18081dde398b5b5ac6e09336b27c";
export const CLASSIC_FACTORY_ADDRESS = "0xdc249ea92d2e532ed63b45dc7c05b21926b97c6f";
export const CROWDPOOLING_FACTORY_V2: string[] = ["0xdc249ea92d2e532ed63b45dc7c05b21926b97c6f"];

export const DVM_FACTORY_DEPLOY_BLOCK = 20178900;
export const DPP_FACTORY_DEPLOY_BLOCK = 20178900;

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BASE_COIN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const TRANSACTION_TYPE_SWAP = "SWAP";
export const TRANSACTION_TYPE_LP_ADD = "LP_ADD";
export const TRANSACTION_TYPE_LP_REMOVE = "LP_REMOVE";
export const TRANSACTION_TYPE_CP_BID = "CP_BID";
export const TRANSACTION_TYPE_CP_CANCEL = "CP_CANCEL";
export const TRANSACTION_TYPE_CP_CLAIM = "CP_CLAIM";

/**
 * usd pricing
 */
export const WRAPPED_BASE_COIN = "0x6d1e851446f4d004ae2a72f9afed85e8829a205e";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xdc1a8a35b0baa3229b13f348ed708a2fd50b5e3a"; //usdt
export const STABLE_TWO_ADDRESS = "0xdc1a8a35b0baa3229b13f348ed708a2fd50b5e3a"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x6d1e851446f4d004ae2a72f9afed85e8829a205e";
export const USDC_WETH_PAIR = "0x0cbe0df132a6c6b4a2974fa1b7fb953cf0cc798a"; // created
export const DAI_WETH_PAIR = "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c"; // created block
export const USDT_WETH_PAIR = "0x7c8dda80bbbe1254a7aacf3219ebe1481c6e01d7"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x2623281ddcc34a73a9e8898f2c57a32a860903f1";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [];

// AMM V3
export const factoryAddress = "0xa97c5a70be5b81f573a688f656e7be569b492a56";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4e0a1d4f6c2548550a983a0c446dd67abd00869d";
export const stablecoinAddresses: string[] = [];
