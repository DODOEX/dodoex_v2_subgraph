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
export const WRAPPED_BASE_COIN = "0xb26c0d8be2960c70641a95a9195be1f59ac83ac0";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x0adcbae18580120667f7ff6c6451a426b13c67b7"; //usdt
export const STABLE_TWO_ADDRESS = "0xab0733588776b8881f7712f6abca98f510e6b63d"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]
