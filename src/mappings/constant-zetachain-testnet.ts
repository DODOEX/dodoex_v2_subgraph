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
export const DODOZooID = "dodoex-v2-zetachain-testnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x119115D4119a504AD0CccD566904ea055C377dE5",
];
export const DVM_FACTORY_ADDRESS = "0x6db1ed60c9d6090C87a280a0592365EE83Ca87Ed";
export const DPP_FACTORY_ADDRESS = "0xa914E15C8295ED2e971f319445a9B27Fc6eE0D85";
export const CLASSIC_FACTORY_ADDRESS =
  "0x385ADF58514D93F55bcFBC2ABC4154fBc0b08fDd";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x385ADF58514D93F55bcFBC2ABC4154fBc0b08fDd",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 9931587;
export const DPP_FACTORY_DEPLOY_BLOCK = 9931587;

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
export const WRAPPED_BASE_COIN = "0x0246DffDa649e877CFd0951837332B4690fAD1EB";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb95ed7e958e196688984951f41ac2888f4b10ab9"; //usdt
export const STABLE_TWO_ADDRESS = "0x46afe01d758a46d64c7d8e0791314d5db3e2e683"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x0246DffDa649e877CFd0951837332B4690fAD1EB";
export const USDC_WETH_PAIR = "0x07d83526730c7438048d55a4fc0b850e2aab6f0b"; // created
export const DAI_WETH_PAIR = "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c"; // created block
export const USDT_WETH_PAIR = "0x9c2dc7377717603eb92b2655c5f2e7997a4945bd"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c", // DAI
  "0x07d83526730c7438048d55a4fc0b850e2aab6f0b", // USDC
  "0x9c2dc7377717603eb92b2655c5f2e7997a4945bd", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x4f8C8E05e946de09d768d062c5e969D1C8920C72";

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
export const factoryAddress = "0x21AD45b37C130a77Acc06DFA752dDb224Aed9943";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4e0a1d4f6c2548550a983a0c446dd67abd00869d";
export const stablecoinAddresses: string[] = [
  "0x07d83526730c7438048d55a4fc0b850e2aab6f0b", // USDC
  "0x9c2dc7377717603eb92b2655c5f2e7997a4945bd", // USDT
];
