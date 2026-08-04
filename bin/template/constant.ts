import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-${chain}";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

// 必须小写地址
export const SMART_ROUTE_ADDRESSES: string[] = ["${DODOV2Proxy02}"];
export const DVM_FACTORY_ADDRESS = "${DVMFactory}";
export const DPP_FACTORY_ADDRESS = "${DPPFactory}";
export const CLASSIC_FACTORY_ADDRESS = "${CrowdPoolingFactory}";
export const CROWDPOOLING_FACTORY_V2: string[] = ["${CrowdPoolingFactory}"];

export const DVM_FACTORY_DEPLOY_BLOCK = ${startBlock};
export const DPP_FACTORY_DEPLOY_BLOCK = ${startBlock};

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
export const WRAPPED_BASE_COIN = "${WETH}";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "${USDT_TOKEN_ADDRESS}"; //usdt
export const STABLE_TWO_ADDRESS = "${USDC_TOKEN_ADDRESS}"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE = "${USDT_USDC_PAIR}"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "${WETH_USDC_PAIR}"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "${WETH}";
export const USDC_WETH_PAIR = "${USDC_WETH_PAIR}"; // created
export const DAI_WETH_PAIR = "${DAI_WETH_PAIR}"; // created block
export const USDT_WETH_PAIR = "${USDT_WETH_PAIR}"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "${UniswapV2Factory}";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [];

// AMM V3
export const factoryAddress = "${UniswapV3Factory}";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "${USDC_WETH_03_POOL}";
export const stablecoinAddresses: string[] = [];
