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
    - bsc : https://pq.hg.network/subgraphs/name/dodoex-v2-bsc/bsc
    - heco : https://q.hg.network/subgraphs/name/dodoex/heco
    - polygon : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-polygon
    - arbitrum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-arbitrum
    - kovan : https://api.thegraph.com/subgraphs/name/autarkxu/dodoex-v2
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-v2-rinkeby
 - token
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token
    - bsc : https://pq.hg.network/subgraphs/name/dodoex-token/bsc
    - heco : https://q.hg.network/subgraphs/name/dodoextoken/heco
    - polygon : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-polygon
    - arbitrum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-arbitrum
    - kovan : https://thegraph.com/explorer/subgraph/autarkxu/dodoex-token
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-token-rinkeby
- vdodo
    - ethereum : https://api.thegraph.com/subgraphs/name/dodoex/dodoex-vdodo
    - kovan : https://api.thegraph.com/subgraphs/name/autarkxu/dodoex-vdodo
- nft
    - kovan : https://api.thegraph.com/subgraphs/name/autarkxu/dodoex-vdodo
    - rinkeby : https://api.thegraph.com/subgraphs/name/dodoex/dodo-nft-rinkeby
    
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
