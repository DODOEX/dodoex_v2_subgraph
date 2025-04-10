import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";

//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-base-mainnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x4CAD0052524648A7Fa2cfE279997b00239295F33",
];
export const DVM_FACTORY_ADDRESS = "0x4CAD0052524648A7Fa2cfE279997b00239295F33";
export const DPP_FACTORY_ADDRESS = "0xc0F9553Df63De5a97Fe64422c8578D0657C360f7";
export const CLASSIC_FACTORY_ADDRESS =
  "0x97bBF5BB1dcfC93A8c67e97E50Bea19DB3416A83";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x97bBF5BB1dcfC93A8c67e97E50Bea19DB3416A83",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 1996181;
export const DPP_FACTORY_DEPLOY_BLOCK = 1996199;

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
export const STABLE_ONE_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"; //usdt
export const STABLE_TWO_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
export const USDC_WETH_PAIR = "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"; // created
export const DAI_WETH_PAIR = "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"; // created block
export const USDT_WETH_PAIR = "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x50c5725949a6f0c72e6c4a641f24049a917db0cb", // DAI
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
  "0x820c137fa70c8691f0e44dc420a5e53c168921dc", // USDS
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x1909B6842964030aF3897bdf8ba760bD91439463";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [
  "0x9ea3b5b4ec044b70375236a281986106457b20ef",
];

// AMM V3
export const factoryAddress = "0xd0de7cA3298fff085E2cb82F8a861a0254256BA0";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C";
export const stablecoinAddresses: string[] = [
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
  "0x820c137fa70c8691f0e44dc420a5e53c168921dc", // USDT
];
