import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-sepolia";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0x6292e8f7647b3b9dDf5795b1Fb77D0187e30E0F9",
];
export const DVM_FACTORY_ADDRESS = "0x2F86652dAEF5f1728c54191C955F065Ec3C188c7";
export const DPP_FACTORY_ADDRESS = "0x0B1467f71c082D8d410aF4376C685D9A6893cF36";
export const CLASSIC_FACTORY_ADDRESS =
  "0xCDA4a6cc5997002B87f28D46852F9F0aA0f3c897";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0xCDA4a6cc5997002B87f28D46852F9F0aA0f3c897",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 58;
export const DPP_FACTORY_DEPLOY_BLOCK = 58;

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
export const WRAPPED_BASE_COIN = "0x7b07164ecfaf0f0d85dfc062bc205a4674c75aa0";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xdbc836c3cb158197e96228fc5b205f91b65e6779"; //usdt
export const STABLE_TWO_ADDRESS = "0x2442e080c0343d8ab683bf5044303082f66f0a7e"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xc5135499e4af076949ecdb0a51ace5d36aaa259c"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0xf444ae517c06c607ae0953501701bd19d70fc251"; //[WETH_USDC_PAIR]

// AMM V2
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const USDC_WETH_PAIR = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"; // created 10008355
export const DAI_WETH_PAIR = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"; // created block 10042267
export const USDT_WETH_PAIR = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // created block 10093341
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
  "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
  "0x0000000000085d4780b73119b644ae5ecd22b376", // TUSD
  "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643", // cDAI
  "0x39aa39c021dfbae8fac545936693ac917d5e7563", // cUSDC
  "0x86fadb80d8d2cff3c3680819e4da99c10232ba0f", // EBASE
  "0x57ab1ec28d129707052df4df418d58a2d46d5f51", // sUSD
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", // MKR
  "0xc00e94cb662c3520282e6f5717214004a7f26888", // COMP
  "0x514910771af9ca656af840dff83e8264ecf986ca", //LINK
  "0x960b236a07cf122663c4303350609a66a7b288c0", //ANT
  "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", //SNX
  "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e", //YFI
  "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8", // yCurv
  "0x853d955acef822db058eb8505911ed77f175b99e", // FRAX
  "0xa47c8bf37f92abed4a126bda807a7b7498661acd", // WUST
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // UNI
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
  "0x956f47f50a910163d8bf957cf5846d573e7f87ca", // FEI
];

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString("400000");

// minimum liquidity for price to get tracked
export let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("2");

export const FACTORY_ADDRESS = "0xCbEf0Cb50b0312CEa0E7378f36f471A4A2e809a8";

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
