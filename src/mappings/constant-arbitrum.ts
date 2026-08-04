import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";

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

export const DODOZooID = "dodoex-v2-arbitrum";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ether";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x45894c062e6f4e58b257e0826675355305dfef0d",
];
export const DVM_FACTORY_ADDRESS = "0xbab9f4ff4a19a0e8eebc56b06750253228ffac6e";
export const DPP_FACTORY_ADDRESS = "0xe55154d09265b18ac7cdac6e646672a5460389a1";
export const CLASSIC_FACTORY_ADDRESS =
  "0x357c5e9cfa8b834edcef7c7aabd8f9db09119d11"; //dodo zoo

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
export const WRAPPED_BASE_COIN = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"; //usdt
export const STABLE_TWO_ADDRESS = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe4b2dfc82977dd2dce7e8d37895a6a8f50cbb4fb"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0xfe176a2b1e1f67250d2903b8d25f56c0dabcd6b2"; //[WETH_USDC_PAIR]
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x9a8c0e8b27fff5d00402733ca67432b6d64faff4",
];

// AMM V2
export const WETH_ADDRESS = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
export const USDC_WETH_PAIR = "0xC6962004f452bE9203591991D15f6b388e09E8D0"; // created
export const DAI_WETH_PAIR = "0xA961F0473dA4864C5eD28e00FcC53a3AAb056c1b"; // created block
export const USDT_WETH_PAIR = "0x641C00A822e8b671738d32a431a4Fb6074E5c79d"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", // DAI
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // USDC
  "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x38886EDE1Fc92886F9a11C37a1f5e75474858eaa";

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
export const factoryAddress = "0xcBF3378D432CB181aae32a6A80AA94CF8e00f534";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9";
export const stablecoinAddresses: string[] = [
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // USDC
  "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
];
