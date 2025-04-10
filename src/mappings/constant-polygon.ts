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
export const DIP3_TIMESTAMP = 1624442400;

export const DODOZooID = "dodoex-v2-polygon";
export const CHAIN_BASE_COIN_SYMBOL = "MATIC";
export const CHAIN_BASE_COIN_NAME = "MATIC";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x45894c062e6f4e58b257e0826675355305dfef0d",
];
export const DVM_FACTORY_ADDRESS = "0xbab9f4ff4a19a0e8eebc56b06750253228ffac6e";
export const DPP_FACTORY_ADDRESS = "0xe55154d09265b18ac7cdac6e646672a5460389a1";
export const CLASSIC_FACTORY_ADDRESS =
  "0x357c5e9cfa8b834edcef7c7aabd8f9db09119d11"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x29e7085fda4a8492fbb16e840488b514149d51f6",
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
export const WRAPPED_BASE_COIN = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"; //usdt
export const STABLE_TWO_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xc9f93163c99695c6526b799ebca2207fdf7d61ad"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75c23271661d9d143dcb617222bc4bec783eff34"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export const USDC_WETH_PAIR = "0x4CcD010148379ea531D6C587CfDd60180196F9b1"; // created
export const DAI_WETH_PAIR = "0x4CcD010148379ea531D6C587CfDd60180196F9b1"; // created block
export const USDT_WETH_PAIR = "0x4CcD010148379ea531D6C587CfDd60180196F9b1"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x562723560131C47417dfcD6BB1A089E4D7C7943C";

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
export const factoryAddress = "0x388371233439cF57bB8C9f2e4835954841cfCb15";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4CcD010148379ea531D6C587CfDd60180196F9b1";
export const stablecoinAddresses: string[] = [
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // USDT
];
