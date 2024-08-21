//mainnet
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOV2Proxy02 = "0x2cd18557e14af72daa8090bcaa95b231ffc9ea26";
export const DIP3_TIMESTAMP = 100;

export const DODOZooID = "dodoex-v2-avax";
export const CHAIN_BASE_COIN_SYMBOL = "AVAX";
export const CHAIN_BASE_COIN_NAME = "avax";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x2cd18557e14af72daa8090bcaa95b231ffc9ea26",
];
export const DVM_FACTORY_ADDRESS = "0xff133a6d335b50bdaa6612d19e1352b049a8ae6a";
export const DPP_FACTORY_ADDRESS = "0xb7865a5cee051d35b09a48b624d7057d3362655a";
export const CLASSIC_FACTORY_ADDRESS =
  "0x8ab2d334ce64b50be9ab04184f7ccba2a6bb6391"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xc1ba6bd60c6790b751ec2d90288b6cbf87d4f032",
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
export const WRAPPED_BASE_COIN = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xc7198437980c041c805a1edcba50c1ce5db95118"; //usdt
export const STABLE_TWO_ADDRESS = "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe4b2dfc82977dd2dce7e8d37895a6a8f50cbb4fb"; //[USDT_USDC_PAIR] todo
//base currency pair
export const BASE_COIN_PAIR = "0xfe176a2b1e1f67250d2903b8d25f56c0dabcd6b2"; //[WETH_USDC_PAIR] todo
