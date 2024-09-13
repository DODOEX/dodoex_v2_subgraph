//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-mantle";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xe7979E2F3e77196Bb2AB206eaa67Ea278A3E33A2",
];
export const DVM_FACTORY_ADDRESS = "0x29C7718e8B606cEF1c44Fe6e43e07aF9D0875DE1";
export const DPP_FACTORY_ADDRESS = "0x46AF6b152F2cb02a3cFcc74014C2617BC4F6cD5C";
export const CLASSIC_FACTORY_ADDRESS =
  "0x6B9577b87666af89bd0e144b9b64e8Ed166E303d";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xE2004eE21f88a7D8e1A5EDc3c9617a0460CC7b99",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 21054048;
export const DPP_FACTORY_DEPLOY_BLOCK = 21054104;

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
export const WRAPPED_BASE_COIN = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x201eba5cc46d216ce6dc03f6a759e8e766e956ae"; //usdt
export const STABLE_TWO_ADDRESS = "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]
