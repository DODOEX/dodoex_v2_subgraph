import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-risechain";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = ["0x79A273d00bBF7B73B92d6938b973f0197b734Acc"];
export const DVM_FACTORY_ADDRESS = "0x3Cdf6B62D042179FAa21745b074a688BB4979FB7";
export const DPP_FACTORY_ADDRESS = "0x928e9762B5223d5A2ac1F5b13E8A61907aCaa9Bd";
export const CLASSIC_FACTORY_ADDRESS = "0x7386F6F2375a38FBD1F4dA1d3eb39cd8dD8d1b40";
export const CROWDPOOLING_FACTORY_V2: string[] = ["0x7386F6F2375a38FBD1F4dA1d3eb39cd8dD8d1b40"];

export const DVM_FACTORY_DEPLOY_BLOCK = 5720756;
export const DPP_FACTORY_DEPLOY_BLOCK = 5720756;

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
export const WRAPPED_BASE_COIN = "0x4200000000000000000000000000000000000006";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xe436820ba0C69702c1d3E601d421c0eF38262739"; //usdt
export const STABLE_TWO_ADDRESS = "0xe436820ba0C69702c1d3E601d421c0eF38262739"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE = "0x0000000000000000000000000000000000000000"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x0000000000000000000000000000000000000000"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
export const USDC_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created
export const DAI_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created block
export const USDT_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x24D48b3A3A4bFf2A42EcB1ebb66613FAFB007bFF";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [];

// AMM V3
export const factoryAddress = "0xcCD262D1A7Cfe02B735369fE94d85e02515E6Ac7";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x0000000000000000000000000000000000000000";
export const stablecoinAddresses: string[] = [];
