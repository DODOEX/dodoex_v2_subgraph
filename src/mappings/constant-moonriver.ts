//mainnet
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DIP3_TIMESTAMP = 868288;

export const DODOV2Proxy02 = "0xa356867fdcea8e71aeaf87805808803806231fdc";

export const DODOZooID = "dodoex-v2-moonriver";
export const CHAIN_BASE_COIN_SYMBOL = "mover";
export const CHAIN_BASE_COIN_NAME = "moonriver";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xd9dec7c3c06e62a4c1beeb07cadf568f496b14c2",
];
export const DVM_FACTORY_ADDRESS = "0x738ebf387a0ce0eb46b0ef8fa5dea2eae6b1df51";
export const DPP_FACTORY_ADDRESS = "0xd0e1aa51df0896c126ce6f8a064e551e0dd3d39b";
export const CLASSIC_FACTORY_ADDRESS =
  "0x02fcb21dc1cf221939c1d4277fb54016b5d32bc7"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x1b75c99c3ab14764aea1511e68b33f5b9138a241",
];

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
export const WRAPPED_BASE_COIN = "0xf50225a84382c74cbdea10b0c176f71fc3de0c4d";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb44a9b6905af7c801311e8f4e76932ee959c663c"; //usdt
export const STABLE_TWO_ADDRESS = "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d"; //usdc
//stable coins pairs todo
export const STABLE_COIN_PAIR_ONE =
  "0xc9f93163c99695c6526b799ebca2207fdf7d61ad"; //[USDT_USDC_PAIR]
//base currency pair todo
export const BASE_COIN_PAIR = "0x75c23271661d9d143dcb617222bc4bec783eff34"; //[WETH_USDC_PAIR]
