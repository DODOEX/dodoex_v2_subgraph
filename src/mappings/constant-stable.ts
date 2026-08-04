import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";

//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-stable";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x07061554978B6b6645cf074E9d85dF409Cc7e433",
];
export const DVM_FACTORY_ADDRESS = "0x63eEc8527884582358Ce6e93d530Df725D5Cf7d1";
export const DPP_FACTORY_ADDRESS = "0x2915386Ddc7bdE7739A82Caa8094d0Fe7376225E";
export const CLASSIC_FACTORY_ADDRESS =
  "0x669c8c9eee43A7e782A2a7D5497eBe6a28f19AcE";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x669c8c9eee43A7e782A2a7D5497eBe6a28f19AcE",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 12513946;
export const DPP_FACTORY_DEPLOY_BLOCK = 12513946;

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
export const WRAPPED_BASE_COIN = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"; //usdt
export const STABLE_TWO_ADDRESS = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736";
export const USDC_WETH_PAIR = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"; // created
export const DAI_WETH_PAIR = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"; // created block
export const USDT_WETH_PAIR = "0x779Ded0c9e1022225f8E0630b35a9b54bE713736"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x779Ded0c9e1022225f8E0630b35a9b54bE713736", // DAI
  "0x779Ded0c9e1022225f8E0630b35a9b54bE713736", // USDC
  "0x779Ded0c9e1022225f8E0630b35a9b54bE713736", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x895df30e99956ad8e831988e160060C3530D7193";

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
export const factoryAddress = "0x9b1F69bfaCF13B8f8fE2aC093C7bae93b08a9C83";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4e0a1d4f6c2548550a983a0c446dd67abd00869d";
export const stablecoinAddresses: string[] = [
  "0x779Ded0c9e1022225f8E0630b35a9b54bE713736", // USDC
  "0x779Ded0c9e1022225f8E0630b35a9b54bE713736", // USDT
];
