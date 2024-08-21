//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-scroll-alpha";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x5b622A373b485CB9BA283ECd6CE6689a8b8FdC05",
];
export const DVM_FACTORY_ADDRESS = "0x0b96b88B1941C3Df77b5A065dD3075fDB7986301";
export const DPP_FACTORY_ADDRESS = "0x19e374C28458a44F67D1524898907AfF9E537462";
export const CLASSIC_FACTORY_ADDRESS =
  "0x168442fec1e1e782c8770185dbb8328b91dc45c0";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x79e15fc9b4154d90424b588533ab277d30d573f4",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 2783342;
export const DPP_FACTORY_DEPLOY_BLOCK = 2783350;

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
