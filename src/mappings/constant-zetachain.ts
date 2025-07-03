import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-zetachain";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xA9f0d65aCAD51d57bCAB20b59601aa3360e7a5c4",
];
export const DVM_FACTORY_ADDRESS = "0xd2b80519a88937A412415bAF1b7Fb1855189EA36";
export const DPP_FACTORY_ADDRESS = "0xC176ecf1Eae0883B2356593d1Ccd5DDEd0441eb1";
export const CLASSIC_FACTORY_ADDRESS =
  "0xf887691d9dA3f7475456e3D970F3FC0c046FdF7B";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xf887691d9dA3f7475456e3D970F3FC0c046FdF7B",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 9121038;
export const DPP_FACTORY_DEPLOY_BLOCK = 9121038;

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
export const WRAPPED_BASE_COIN = "0x5F0b1a82749cb4E2278EC87F8BF6B618dC71a8bf";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x7c8dDa80bbBE1254a7aACf3219EBe1481c6E01d7"; //usdt
export const STABLE_TWO_ADDRESS = "0x0cbe0dF132a6c6B4a2974Fa1b7Fb953CF0Cc798a"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x3019b247381c850ab53dc0ee53bce7a07ea9155f";
export const USDC_WETH_PAIR = "0x0cbe0dF132a6c6B4a2974Fa1b7Fb953CF0Cc798a"; // created
export const DAI_WETH_PAIR = "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c"; // created block
export const USDT_WETH_PAIR = "0x7c8dDa80bbBE1254a7aACf3219EBe1481c6E01d7"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x4E36B2e9c9c9bfDd2516cAdacF07f5adAA33EF88";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [];

// AMM V3
export const factoryAddress = "0x9f48Ddad075e569cDc70D657D3aC171e23846009";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4e0a1d4f6c2548550a983a0c446dd67abd00869d";
export const stablecoinAddresses: string[] = [];
