//mainnet
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOV2Proxy02 = "0x45894c062e6f4e58b257e0826675355305dfef0d";
export const DIP3_TIMESTAMP = 100;

export const DODOZooID = "dodoex-v2-aurora";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ether";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xd9dec7c3c06e62a4c1beeb07cadf568f496b14c2",
];
export const DVM_FACTORY_ADDRESS = "0x5515363c0412add5c72d3e302fe1bd7dcbcf93fe";
export const DPP_FACTORY_ADDRESS = "0x40672211d4310ad71dadc8cde7aa3fb90d420855";
export const CLASSIC_FACTORY_ADDRESS =
  "0x357c5e9cfa8b834edcef7c7aabd8f9db09119d11"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xaf49dbaaf177bee57f84731260a9eb8819d25eff",
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
export const WRAPPED_BASE_COIN = "0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x4988a896b1227218e4a686fde5eabdcabd91571f"; //usdt
export const STABLE_TWO_ADDRESS = "0xb12bfca5a55806aaf64e99521918a4bf0fc40802"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe4b2dfc82977dd2dce7e8d37895a6a8f50cbb4fb"; //[USDT_USDC_PAIR] todo
//base currency pair
export const BASE_COIN_PAIR = "0xfe176a2b1e1f67250d2903b8d25f56c0dabcd6b2"; //[WETH_USDC_PAIR] todo
