//kovan
export const TYPE_VIRTUAL_POOL = "VIRTUAL";
export const TYPE_DVM_POOL = "DVM";
export const TYPE_DPP_POOL = "DPP";
export const TYPE_DSP_POOL = "DSP";
export const TYPE_GSP_POOL = "GSP";
export const TYPE_CLASSICAL_POOL = "CLASSICAL";
export const SOURCE_SMART_ROUTE = "SMART_ROUTE";
export const SOURCE_POOL_SWAP = "DODO_POOL";
export const DODOZooID = "dodoex-v2-cfx";
export const CHAIN_BASE_COIN_SYMBOL = "CFX";
export const CHAIN_BASE_COIN_NAME = "conflux";
export const DIP3_TIMESTAMP = 1624442400;

export const SMART_ROUTE_ADDRESSES: string[] = [
  "0xbce44767af0a53A108b3B7ba4F740E03D228Ec0A",
];
export const DVM_FACTORY_ADDRESS = "0xc77392396be1fb5143f1f66a3ae67dd03fbaba27";
export const DPP_FACTORY_ADDRESS = "0xaC9a7053bC23D22ecC50F82cc9143d16bbC0E621";
export const CLASSIC_FACTORY_ADDRESS =
  "0x168442fec1e1e782c8770185dbb8328b91dc45c0";
export const CROWDPOOLING_FACTORY_V2: string[] = [
  "0x79e15fc9b4154d90424b588533ab277d30d573f4",
];

export const DVM_FACTORY_DEPLOY_BLOCK = 70692327;
export const DPP_FACTORY_DEPLOY_BLOCK = 70692370;

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
export const WRAPPED_BASE_COIN = "0xb26c0d8be2960c70641a95a9195be1f59ac83ac0";
//pricing supported stable coins
export const STABLE_ONE_ADDRESS = "0xfe97e85d13abd9c1c33384e796f10b73905637ce"; //usdt
export const STABLE_TWO_ADDRESS = "0x6963efed0ab40f6c3d7bda44a05dcf1437c44372"; //usdc
//stable coins pairs
export const STABLE_COIN_PAIR_ONE =
  "0xa5dcd75c853dad730bef4ece3d20f0be7e297a6a"; //[USDT_USDC_PAIR]
//base currency pair
export const BASE_COIN_PAIR = "0x0736b3384531cda2f545f5449e84c6c6bcd6f01b"; //[WETH_USDC_PAIR]
