//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-zero-mainnet";
export const CHAIN_BASE_COIN_SYMBOL = "ETH";
export const CHAIN_BASE_COIN_NAME = "ethereum";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xd4232aBF37D2A851A2DfA289F76cc6aB933addCF",
];
export const DVM_FACTORY_ADDRESS = "0x12b73877321b53e41C33c3850d0C04e23de2792F";
export const DPP_FACTORY_ADDRESS = "0x794717Fe9ED50d88e3F1ACfF7eA1A89963c109fd";
export const CLASSIC_FACTORY_ADDRESS =
  "0x3BD357e0D40249441f90fb57a77BD0beC76f2E8A";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x3BD357e0D40249441f90fb57a77BD0beC76f2E8A",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 1000;
export const DPP_FACTORY_DEPLOY_BLOCK = 1000;

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
export const WRAPPED_BASE_COIN = "0xAc98B49576B1C892ba6BFae08fE1BB0d80Cf599c";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xb95ed7e958e196688984951f41ac2888f4b10ab9"; //usdt
export const STABLE_TWO_ADDRESS = "0x6a6394F47DD0BAF794808F2749C09bd4Ee874E70"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xe8c1b7e0505c97c59ff2f12ebf91a8eaa59d4c73"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x75f5d66a7bbb9330a9067c0833ec9b3198b71666"; //[WETH_USDC_PAIR]
