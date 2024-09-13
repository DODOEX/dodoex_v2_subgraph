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

export const DODOZooID = "dodoex-v2-boba";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ether";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x55793c2c8a796cce00ef2d1a86cca2e0399bf285",
];
export const DVM_FACTORY_ADDRESS = "0x2f2f9460500f27db68aafbfa0472ceddb168a5a6";
export const DPP_FACTORY_ADDRESS = "0x3a60a76acae8feec74d6b5b665d4dbaab2abc406";
export const CLASSIC_FACTORY_ADDRESS =
  "0x357c5e9cfa8b834edcef7c7aabd8f9db09119d11"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x392b2ae9ab6161591582c4724ca9a89c0cc1cab6",
];

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BASE_COIN = "0x4200000000000000000000000000000000000006";

export const TRANSACTION_TYPE_SWAP = "SWAP";
export const TRANSACTION_TYPE_LP_ADD = "LP_ADD";
export const TRANSACTION_TYPE_LP_REMOVE = "LP_REMOVE";
export const TRANSACTION_TYPE_CP_BID = "CP_BID";
export const TRANSACTION_TYPE_CP_CANCEL = "CP_CANCEL";
export const TRANSACTION_TYPE_CP_CLAIM = "CP_CLAIM";

/**
 * usd pricing
 */
export const WRAPPED_BASE_COIN = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x5de1677344d3cb0d7d465c10b72a8f60699c062d"; //usdt
export const STABLE_TWO_ADDRESS = "0x66a2a913e447d6b4bf33efbec43aaef87890fbbc"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe4b2dfc82977dd2dce7e8d37895a6a8f50cbb4fb"; //[USDT_USDC_PAIR] todo
//base currency pair
export const BASE_COIN_PAIR = "0xfe176a2b1e1f67250d2903b8d25f56c0dabcd6b2"; //[WETH_USDC_PAIR] todo
