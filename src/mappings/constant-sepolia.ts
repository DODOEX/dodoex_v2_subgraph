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
