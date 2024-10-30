//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-morph";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xfcd8EF54A4dA96dE6B2DDF67C6265C7405a3A9c6",
];
export const DVM_FACTORY_ADDRESS = "0x6694eebf40924e04c952EA8F1626d19E7a656Bb7";
export const DPP_FACTORY_ADDRESS = "0x297A4885a7da4AaeF340FABEd119e7a6E3f2BCe8";
export const CLASSIC_FACTORY_ADDRESS =
  "0xc6F5e5Ff8AbBe6A94A879A1E378c101E2A6bb9e6";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xc6F5e5Ff8AbBe6A94A879A1E378c101E2A6bb9e6",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 192911;
export const DPP_FACTORY_DEPLOY_BLOCK = 192911;

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
export const WRAPPED_BASE_COIN = "0x5300000000000000000000000000000000000011";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xc7D67A9cBB121b3b0b9c053DD9f469523243379A"; //usdt
export const STABLE_TWO_ADDRESS = "0x46afe01d758a46d64c7d8e0791314d5db3e2e683"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]
