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
export const DODOZooID = "dodoex-v2-pharos-testnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x4b177AdEd3b8bD1D5D747F91B9E853513838Cd49",
];
export const DVM_FACTORY_ADDRESS = "0xbA1d9EFA53Ac545779CBf483a192DacC06820fD2";
export const DPP_FACTORY_ADDRESS = "0xeCF9631022e30e433a2a02E3bF8a7Ba2234F524b";
export const CLASSIC_FACTORY_ADDRESS =
  "0x8146e09183fb7ECae8339b31EE461Ef91aAd2E66";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x8146e09183fb7ECae8339b31EE461Ef91aAd2E66",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 9682639;
export const DPP_FACTORY_DEPLOY_BLOCK = 9682639;

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
export const WRAPPED_BASE_COIN = "0x3019b247381c850ab53dc0ee53bce7a07ea9155f";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb95ed7e958e196688984951f41ac2888f4b10ab9"; //usdt
export const STABLE_TWO_ADDRESS = "0x46afe01d758a46d64c7d8e0791314d5db3e2e683"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x3019b247381c850ab53dc0ee53bce7a07ea9155f";
export const USDC_WETH_PAIR = "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED"; // created
export const DAI_WETH_PAIR = "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c"; // created block
export const USDT_WETH_PAIR = "0xD4071393f8716661958F766DF660033b3d35fD29"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x7d02a3e0180451b17e5d7f29ef78d06f8117106c", // DAI
  "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", // USDC
  "0xD4071393f8716661958F766DF660033b3d35fD29", // USDT
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x7b29694E8d44c154E3a2c20A6A2D665D65264e6e";

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
export const factoryAddress = "0x711b476cbEb92803500Dea10CAeb35741d4c33f7";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x4e0a1d4f6c2548550a983a0c446dd67abd00869d";
export const stablecoinAddresses: string[] = [
  "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", // USDC
  "0xD4071393f8716661958F766DF660033b3d35fD29", // USDT
];
