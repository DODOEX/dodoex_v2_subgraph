import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-neox";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x90e3C36f1c668d5c8fED3Bc7797e0c2e767EfBd2",
];
export const DVM_FACTORY_ADDRESS = "0xE59d098c36916397Cc14AB42Bb0F00093BDA9f04";
export const DPP_FACTORY_ADDRESS = "0x4d89ceaf1EACf83909e1CA0d508B132d7e204A5d";
export const CLASSIC_FACTORY_ADDRESS =
  "0x9fEA2Ada0688B11138cEceA294CDF7d7564347Aa";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x9fEA2Ada0688B11138cEceA294CDF7d7564347Aa",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 868418;
export const DPP_FACTORY_DEPLOY_BLOCK = 868418;

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
export const WRAPPED_BASE_COIN = "0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x242D405a58F2358eC2810De195b31FbD0508bb18"; //usdt
export const STABLE_TWO_ADDRESS = "0x68b55E582961968ef7758D8454D8A3e78c692e0B"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF";
export const USDC_WETH_PAIR = "0x242D405a58F2358eC2810De195b31FbD0508bb18"; // usdc not found
export const DAI_WETH_PAIR = "0x242D405a58F2358eC2810De195b31FbD0508bb18"; // dai not found
export const USDT_WETH_PAIR = "0x242D405a58F2358eC2810De195b31FbD0508bb18"; // usdt
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  "0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF", // WGAS
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x3a64Ec3606FF7310E8fAd6FcC008e39705fB496d";

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
