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
export const DODOZooID = "dodoex-v2-monad-testnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xF5378974cfD5042A58c458E06cB6D2A2D1c2FAF8",
];
export const DVM_FACTORY_ADDRESS = "0x306ae919b99c187Fe5eCBdE980E24228ae888182";
export const DPP_FACTORY_ADDRESS = "0x82B26eb18382f7532015248078AB1f6030413396";
export const CLASSIC_FACTORY_ADDRESS =
  "0x297B5D923b9C18081ddE398B5b5aC6E09336B27c";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x297B5D923b9C18081ddE398B5b5aC6E09336B27c",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 5285960;
export const DPP_FACTORY_DEPLOY_BLOCK = 5285960;

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
export const WRAPPED_BASE_COIN = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"; //usdt
export const STABLE_TWO_ADDRESS = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701";
export const USDC_WETH_PAIR = "0x07d83526730c7438048d55a4fc0b850e2aab6f0b"; // created
export const DAI_WETH_PAIR = "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c"; // created block
export const USDT_WETH_PAIR = "0x9c2dc7377717603eb92b2655c5f2e7997a4945bd"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // DAI
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDC
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0xC176ecf1Eae0883B2356593d1Ccd5DDEd0441eb1";

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
export const factoryAddress = "0x816D85D853a7Da1f91F427e4132056D88620e7d7";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x88B96aF200c8a9c35442C8AC6cd3D22695AaE4F0";
export const stablecoinAddresses: string[] = [
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDC
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDT
];
