//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-zircuit-testnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x3b0c6c0CE667844e742Ce0Ca533EaA2b6f422AA8",
];
export const DVM_FACTORY_ADDRESS = "0x7Ad992fcebd899ddbEF7f031dCF96f382b81ECea";
export const DPP_FACTORY_ADDRESS = "0x5e132c0ABB9e4E5f1471eF6d1C9740c276Fe520e";
export const CLASSIC_FACTORY_ADDRESS =
  "0xB3d4823e02A9AB9A9A0Cc1636E776c360B67bED1";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xB3d4823e02A9AB9A9A0Cc1636E776c360B67bED1",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 58;
export const DPP_FACTORY_DEPLOY_BLOCK = 58;

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
export const WRAPPED_BASE_COIN = "0x3a64Ec3606FF7310E8fAd6FcC008e39705fB496d";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb95ed7e958e196688984951f41ac2888f4b10ab9"; //usdt
export const STABLE_TWO_ADDRESS = "0x46afe01d758a46d64c7d8e0791314d5db3e2e683"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]
