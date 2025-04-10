import { BigDecimal, BigInt } from "@graphprotocol/graph-ts/index";

//bsc
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOV2Proxy01 = "0xb57dd5c265dbb13ca014f2332069e90cd0e22e65";
export const DODOV2Proxy02_2021_02_17 =
  "0xd56281ef996b6b29874c77d2e1464216e8043127";
export const DODOV2Proxy02 = "0xd56281ef996b6b29874c77d2e1464216e8043127";
export const DIP3_TIMESTAMP = 1624442400;

export const DODOZooID = "dodoex-v2-bsc";
export const CHAIN_BASE_COIN_SYMBOL = "BNB";
export const CHAIN_BASE_COIN_NAME = "Bnb";

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xb57dd5c265dbb13ca014f2332069e90cd0e22e65",
  "0xd56281ef996b6b29874c77d2e1464216e8043127",
  "0x8f8dd7db1bda5ed3da8c9daf3bfa471c12d58486",
  "0xbe9a66e49503e84ae59a4d0545365AABedf33b40",
];
export const DVM_FACTORY_ADDRESS = "0xf50bdc9e90b7a1c138cb7935071b85c417c4cb8e";
export const DPP_FACTORY_ADDRESS = "0x7737fd30535c69545deeea54ab8dd590ccaebd3c";
export const CLASSIC_FACTORY_ADDRESS =
  "0xca459456a45e300aa7ef447dbb60f87cccb42828"; //dodo zoo
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x9c9ef6820a1aa0e25770ccde4e974f81cb28debc",
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
export const WRAPPED_BASE_COIN = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0x55d398326f99059ff775485246999027b3197955"; //usdt
export const STABLE_TWO_ADDRESS = "0xe9e7cea3dedca5984780bafc599bd69add087d56"; //busd
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xbe60d4c4250438344bec816ec2dec99925deb4c7"; //[USDT_BUSD_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x327134de48fcdd75320f4c32498d1980470249ae"; //[WBNB_BUSD_PAIR]

// AMM V2
export const WETH_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export const USDC_WETH_PAIR = "0x47a90A2d92A8367A91EfA1906bFc8c1E05bf10c4"; // created
export const DAI_WETH_PAIR = "0x47a90A2d92A8367A91EfA1906bFc8c1E05bf10c4"; // created block
export const USDT_WETH_PAIR = "0x47a90A2d92A8367A91EfA1906bFc8c1E05bf10c4"; // created block
// token where amounts should contribute to tracked volume and liquidity
export let WHITELIST: string[] = [
  WETH_ADDRESS, // WETH
  "0x50c5725949a6f0c72e6c4a641f24049a917db0cb", // DAI
  "0x8965349fb649a33a30cbfda057d8ec2c48abe2a2", // USDC
  "0x55d398326f99059ff775485246999027b3197955", // USDT
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
export const factoryAddress = "0x814473c0f2a32c57b98585157b78ea02a41f70fb";
export const WHITELIST_TOKENS: string[] = WHITELIST;
export const USDC_WETH_03_POOL = "0x47a90A2d92A8367A91EfA1906bFc8c1E05bf10c4";
export const stablecoinAddresses: string[] = [
  "0x8965349fb649a33a30cbfda057d8ec2c48abe2a2", // USDC
  "0x55d398326f99059ff775485246999027b3197955", // USDT
];
