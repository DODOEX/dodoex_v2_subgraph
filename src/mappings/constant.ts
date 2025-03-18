import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-plume";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x928e9762B5223d5A2ac1F5b13E8A61907aCaa9Bd",
];
export const DVM_FACTORY_ADDRESS = "0xd0de7cA3298fff085E2cb82F8a861a0254256BA0";
export const DPP_FACTORY_ADDRESS = "0xc6F5e5Ff8AbBe6A94A879A1E378c101E2A6bb9e6";
export const CLASSIC_FACTORY_ADDRESS =
  "0x8Ebbfe204E7EdA4be46b9d09c5dfa8b3e1500462";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x8Ebbfe204E7EdA4be46b9d09c5dfa8b3e1500462",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 54690;
export const DPP_FACTORY_DEPLOY_BLOCK = 54690;

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
export const WRAPPED_BASE_COIN = "0x562723560131C47417dfcD6BB1A089E4D7C7943C";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb95ed7e958e196688984951f41ac2888f4b10ab9"; //usdt
export const STABLE_TWO_ADDRESS = "0x46afe01d758a46d64c7d8e0791314d5db3e2e683"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x562723560131C47417dfcD6BB1A089E4D7C7943C";
export const USDC_WETH_PAIR = "0x28E0f0eed8d6A6a96033feEe8b2D7F32EB5CCc48"; // usdc
export const DAI_WETH_PAIR = "0x28E0f0eed8d6A6a96033feEe8b2D7F32EB5CCc48"; // dai not found
export const USDT_WETH_PAIR = "0x28E0f0eed8d6A6a96033feEe8b2D7F32EB5CCc48"; // usdt not found
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  "0x562723560131C47417dfcD6BB1A089E4D7C7943C", // WETH
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x8b09DB11ea380d6454D2592D334FFC319ce6EF3E";

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
