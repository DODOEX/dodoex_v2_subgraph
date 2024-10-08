const studioNodeUrl = "https://api.studio.thegraph.com/deploy/";
const theGraphNodeUrl = "https://api.thegraph.com/deploy/";
const theGraphIpfsUrl = "https://api.thegraph.com/ipfs/";
const localNodeUrl = "http://127.0.0.1:8020";
const localIpfsUrl = "http://127.0.0.1:5001";
const chains = [
  "mainnet",
  "bsc",
  "rinkeby",
  "kovan",
  "okchain",
  "arbitrum",
  "polygon",
  "optimism",
  "heco",
  "moonriver",
  "boba",
  "aurora",
  "avax",
  "cfx",
  "base",
  "base_mainnet",
  "scroll-alpha",
  "scroll-sepolia",
  "linea",
  "scroll",
  "manta",
  "mantle",
  "tokb",
  "dodochain-testnet",
  "bitlayer",
  "zircuit-testnet",
  "arb-sep",
  "zircuit",
  "sepolia",
  "okb",
];
const supportAlphaChains = ["arbitrum", "polygon", "mainnet"];
const supportStudioChains = [
  "arbitrum",
  "polygon",
  "mainnet",
  "arb-sep",
  "sepolia",
];
module.exports = {
  studioNodeUrl,
  theGraphNodeUrl,
  theGraphIpfsUrl,
  localNodeUrl,
  localIpfsUrl,
  chains,
  supportAlphaChains,
  supportStudioChains,
};
