import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-pharos";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = ["0x6F1142F4BF632E4877497c05818492824F540Ad5"];
export const DVM_FACTORY_ADDRESS = "0xB9319bCEe26F1A6AC7207A738B021cdEC771b30E";
export const DPP_FACTORY_ADDRESS = "0x02d2e6292eC57E84E183909cD0F7Ca513ADdC717";
export const CLASSIC_FACTORY_ADDRESS = "0x1c3E8553BD77d903747255FB533e29d2f7a739f9";
export const CROWDPOOLING_FACTORY_V2: string[] = ["0x1c3E8553BD77d903747255FB533e29d2f7a739f9"];

export const DVM_FACTORY_DEPLOY_BLOCK = 4155364;
export const DPP_FACTORY_DEPLOY_BLOCK = 4155364;

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
export const WRAPPED_BASE_COIN = "0x52c48d4213107b20bc583832b0d951fb9ca8f0b0";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x7126c3fef4e6a680eee09fb039b2236f638384b0"; //usdt
export const STABLE_TWO_ADDRESS = "0x7126c3fef4e6a680eee09fb039b2236f638384b0"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE = "0x0000000000000000000000000000000000000000"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x0000000000000000000000000000000000000000"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0x52c48d4213107b20bc583832b0d951fb9ca8f0b0";
export const USDC_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created
export const DAI_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created block
export const USDT_WETH_PAIR = "0x0000000000000000000000000000000000000000"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0x18Fab7d7027E9FB33Fa90ca607439449209F7B09";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [];

// AMM V3
export const factoryAddress = "0x2c90CcB0b989afA2433F499698451a25744A552b";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x0000000000000000000000000000000000000000";
export const stablecoinAddresses: string[] = [];
