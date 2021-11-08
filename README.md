# Subgraph for dodoex.io

The Graph exposes a GraphQL endpoint to query the events and entities within the DODOex ecosystem.

[Go to thegraph playground : DODOEX](https://thegraph.com/explorer/subgraph/dodoex/dodoex-v2)

[Go to thegraph playground : vDODO](https://thegraph.com/explorer/subgraph/dodoex/dodoex-vdodo?selected=playground)

[Go to thegraph playground : ERC20Token](https://thegraph.com/explorer/subgraph/dodoex/dodoex-token)

## 1、 Introduce

**Attention**
 - In `Pair` entities,there is a virtual pool type,this is what we use when we do data statistics. In fact, DODO does not have these Pools. Please exclude the Pairs of type 'VIRTUAL'.

**What is in OrderHistory**
 - Each *OrderHistory* event emit by DODOSmartRoute contract，if swap goes into the dodo liquidity pool, pool swap event will be ignored. 
 - If swap tx isn't from DODOSmartRoute, swap event from each dodo liquidity pool will be record as *OrderHistory*.

**What is in Swap** 
 - Each swap event emit from dodo liquidity pool
 
**Where to find pool information**
 - In *Pair*  we track pool status.

**Endpoints**
 - dodoex 
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2
    - bsc : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-bsc
    - heco : https://n10.hg.network/subgraphs/name/dodoex-v2-heco-hg/heco
    - polygon : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-polygon
    - okchain : https://graph.kkt.one/subgraphs/name/dodoex/dodoex-v2-okchain
    - arbitrum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-arbitrum
    - kovan : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-kovan
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-rinkeby
    - moonriver : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-moonriver
  - token
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token
    - bsc : https://n14.hg.network/subgraphs/name/dodoex-token-bsc/bsc
    - heco : https://n10.hg.network/subgraphs/name/dodoex-token-heco/heco
    - polygon : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-polygon
    - okchain : https://graph.kkt.one/subgraphs/name/dodoex/dodoex-token-okchain
    - arbitrum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-arbitrum
    - kovan : https://thegraph.com/explorer/subgraph/autarkxu/dodoex-token
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-rinkeby
    - moonriver : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-moonriver
- vdodo
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-vdodo
    - kovan : https://api.thegraph.com/subgraphs/name/autarkxu/dodoex-vdodo
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-vdodo-rinkeby
- nft
    - kovan : https://api.thegraph.com/subgraphs/name/autarkxu/dodoex-vdodo
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodo-nft-rinkeby
 - mine
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-mine-v3
    - bsc : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-mine-v3-bsc
    - heco : https://n10.hg.network/subgraphs/name/dodoex-mine-v3-heco/heco
    - polygon : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-mine-v3-polygon
    - okchain : https://graph.kkt.one/subgraphs/name/dodoex/dodoex-mine-v3-okchain
    - arbitrum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-mine-v3-arbitrum
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodomine-rinkeby
    - moonriver : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-mine-v3-moonriver
   
## 2、 Graphql Examples
 - to get user info
```
{
  user(id:"0x8982a82a77eaf1cd6f490b67ad982304ecc590af"){
    id
    txCount
    tradingRewardRecieved
  }
}

```
 - to get pair data for statistics use pairDayData、pairHourData
```
{
  pairDayDatas(first:100,orderBy:date,orderDirection:desc){
    date
    volumeBase
    volumeQuote
    feeBase
    feeQuote
    baseToken{
      symbol
    }
    quoteToken{
      symbol
    }
  }
}
```
 - to get crowdpooling info
```
{
  crowdPoolingDayDatas{
    date
    crowdPooling {
      id
      creator
      baseToken{
        symbol
      }
      quoteToken{
        symbol
      }
    }
    investedQuote
    investCount
    newcome
    poolQuote
  }
  
}
```
