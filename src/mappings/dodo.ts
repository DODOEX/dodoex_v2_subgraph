/* eslint-disable prefer-const */

import {log, Address, BigDecimal, BigInt} from '@graphprotocol/graph-ts'
import {
    DODOZoo_ADDRESS,
    ONE_BD,
    ONE_BI,
    ZERO_BD,
    ZERO_BI,
    fetchTokenSymbol,
    fetchTokenName,
    fetchTokenDecimals,
    fetchTokenTotalSupply,
    createUser,
    convertTokenToDecimal,
    getLpToken,
    getDODOPair,
    createLiquidityPosition,
    createLiquiditySnapshot
} from './helpers'
import {DODOBirth} from '../types/DodoZoo/DodoZoo'
import {DodoZoo, Token, Pair, User, Transaction, Mint, Swap, LpToken} from '../types/schema'
import {Deposit, Withdraw, DODO, BuyBaseToken, SellBaseToken} from '../types/templates/DODO/DODO';
import {ERC20} from '../types/DodoZoo/ERC20';
import {updatePairDayData, updatePairHourData, updateDodoDayData, updateTokenDayData} from "./dayUpdates";

export function handleDeposit(event: Deposit): void {

    //交易信息录入
    let transactionHash = event.transaction.hash.toHexString();
    let transaction = Transaction.load(transactionHash);
    if (transaction === null) {
        transaction = new Transaction(transactionHash)
        transaction.blockNumber = event.block.number
        transaction.timestamp = event.block.timestamp
        transaction.mints = []
        transaction.burns = []
        transaction.swaps = []
    }

    //1、检查并创建用户信息
    createUser(event.params.payer);

    //2、更新DODOZoo交易数据 更新pair信息
    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);

    let dodo = getDODOPair(event.address);
    dodo.txCount = dodo.txCount.plus(ONE_BI);

    //3、更新bToken、qToken交易数据
    let baseToken = Token.load(dodo.baseToken);
    let quoteToken = Token.load(dodo.quoteToken);

    let dealedAmount: BigDecimal;
    if (event.params.isBaseToken == true) {
        dealedAmount = convertTokenToDecimal(event.params.amount, baseToken.decimals);
        baseToken.totalLiquidity = baseToken.totalLiquidity.plus(dealedAmount);
        baseToken.txCount = baseToken.txCount.plus(ONE_BI);

        dodo.baseReserve = dodo.quoteReserve.plus(dealedAmount);
        dodo.baseLiquidityProviderCount = dodo.baseLiquidityProviderCount.plus(ONE_BI);
    } else {
        dealedAmount = convertTokenToDecimal(event.params.amount, quoteToken.decimals);
        quoteToken.totalLiquidity = quoteToken.totalLiquidity.plus(dealedAmount);
        quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

        dodo.quoteReserve = dodo.quoteReserve.plus(dealedAmount);
        dodo.quoteLiquidityProviderCount = dodo.quoteLiquidityProviderCount.plus(ONE_BI);
    }

    //4、添加一条新的Deposit（Mint）记录 && 更新lptoken信息
    let mints = transaction.mints;
    let mint = Mint.load(transactionHash.concat('-').concat(BigInt.fromI32(mints.length).toString()));
    let baseLpToken = getLpToken(Address.fromString(dodo.baseLpToken));
    let quoteLpToken = getLpToken(Address.fromString(dodo.quoteLpToken));
    if (mint == null) {
        mint = new Mint(transactionHash.concat('-').concat(event.logIndex.toString()));
        mint.transaction = transactionHash;
        mint.pair = dodo.id;
        mint.to = event.params.receiver;
        mint.timestamp = event.block.timestamp;
        if (event.params.isBaseToken == true) {
            mint.baseAmount = dealedAmount;
            mint.baseLpAmount = convertTokenToDecimal(event.params.lpTokenAmount, baseLpToken.decimals);
        } else {
            mint.quoteAmount = dealedAmount;
            mint.quoteLpAmount = convertTokenToDecimal(event.params.lpTokenAmount, quoteLpToken.decimals);
        }
        mint.logIndex = event.logIndex;
    }
    transaction.mints.concat([mint.id]);

    dodoZoo.save();
    dodo.save();
    baseToken.save();
    quoteToken.save();
    transaction.save();

    //5、更新用户流动性信息、并创建流动性信息快照
    let liquidityPosition = createLiquidityPosition(event.address, event.params.payer);
    let baseLPContract = ERC20.bind(Address.fromString(dodo.baseLpToken));
    let quoteLPContract = ERC20.bind(Address.fromString(dodo.quoteLpToken));
    liquidityPosition.baseLpTokenBalance = convertTokenToDecimal(baseLPContract.balanceOf(event.params.receiver), baseLpToken.decimals);
    liquidityPosition.quoteLpTokenBalance = convertTokenToDecimal(quoteLPContract.balanceOf(event.params.receiver), quoteLpToken.decimals);
    createLiquiditySnapshot(liquidityPosition, event);

    //todo 创建周期数据
    let pairHourData = updatePairHourData(event);
    let dodoDayData = updateDodoDayData(event);
    let baseTokenDayData = updateTokenDayData(baseToken as Token, event);
    let quoteTokenData = updateTokenDayData(quoteToken as Token, event);
}

export function handleWithdraw(event: Withdraw): void {
    //todo


}

export function handleSellBaseToken(event: BuyBaseToken): void {

    let pair = Pair.load(event.address.toHexString());
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let baseTokenTradeAmount = convertTokenToDecimal(event.params.receiveBase, baseToken.decimals);
    let quoteTokenTradeAmount = convertTokenToDecimal(event.params.payQuote, quoteToken.decimals);

    //更新basetoken、quotetoken信息
    baseToken.tradeVolume = baseToken.tradeVolume.plus(baseTokenTradeAmount);
    quoteToken.tradeVolume = quoteToken.tradeVolume.plus(quoteTokenTradeAmount);
    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    //更新pair信息
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseTokenTradeAmount);
    pair.volumeQuoteToken = pair.volumeBaseToken.plus(quoteTokenTradeAmount);
    pair.save();

    //更新DodoZoo总计信息
    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    dodoZoo.totalVolumeUSD = quoteTokenTradeAmount.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);

    let transaction = Transaction.load(event.transaction.hash.toHexString());
    if (transaction === null) {
        transaction = new Transaction(event.transaction.hash.toHexString());
        transaction.blockNumber = event.block.number;
        transaction.timestamp = event.block.timestamp;
        transaction.mints = [];
        transaction.swaps = [];
        transaction.burns = [];
    }

    let swaps = transaction.swaps;

    let swap = new Swap(event.transaction.hash.toHexString().concat('-').concat(BigInt.fromI32(swaps.length).toString()));
    //swap填数据
    swap.transaction = transaction.id;
    swap.pair = pair.id;
    swap.timestamp = transaction.timestamp;
    swap.sender = event.params.buyer;
    swap.baseSwaped = baseTokenTradeAmount;
    swap.quoteSwaped = quoteTokenTradeAmount;
    swap.to = event.params.buyer;
    swap.from = event.transaction.from;
    swap.logIndex = event.logIndex;
    swap.amountUSD = quoteTokenTradeAmount.plus(quoteTokenTradeAmount);
    swap.isSellBase = true;

    swap.save();
    swaps.push(swap.id);
    transaction.swaps = swaps;
    transaction.save();

    let pairDayData = updatePairDayData(event);
    let pairHourData = updatePairHourData(event);
    let dodoDayData = updateDodoDayData(event);
    let baseTokenDayData = updateTokenDayData(baseToken as Token, event);
    let quoteTokenData = updateTokenDayData(quoteToken as Token, event);

    dodoDayData.dailyVolumeUSD = dodoDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    dodoDayData.save();

    pairDayData.dailyVolumeBase = pairDayData.dailyVolumeBase.plus(baseTokenTradeAmount);
    pairDayData.dailyVolumeQuote = pairDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount);
    pairDayData.dailyVolumeUSD = pairDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    pairDayData.save();

    pairHourData.hourlyVolumeBase = pairHourData.hourlyVolumeBase.plus(baseTokenTradeAmount);
    pairHourData.hourlyVolumeQuote = pairHourData.hourlyVolumeQuote.plus(quoteTokenTradeAmount);
    pairHourData.hourlyVolumeUSD = pairHourData.hourlyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    pairHourData.save();

    baseTokenDayData.dailyVolumeToken = baseTokenDayData.dailyVolumeToken.plus(baseTokenTradeAmount);
    baseTokenDayData.dailyVolumeUSD = baseTokenDayData.totalLiquidityUSD.plus(quoteTokenTradeAmount);
    baseTokenDayData.save();

    quoteTokenData.dailyVolumeToken = quoteTokenData.dailyVolumeToken.plus(quoteTokenTradeAmount);
    quoteTokenData.dailyVolumeUSD = quoteTokenData.dailyVolumeUSD.plus(quoteTokenTradeAmount);
    quoteTokenData.save();

}

export function handleBuyBaseToken(event: SellBaseToken): void {
    let pair = Pair.load(event.address.toHexString());
    let baseToken = Token.load(pair.baseToken);
    let quoteToken = Token.load(pair.quoteToken);

    let baseTokenTradeAmount = convertTokenToDecimal(event.params.payBase, baseToken.decimals);
    let quoteTokenTradeAmount = convertTokenToDecimal(event.params.receiveQuote, quoteToken.decimals);

    //更新basetoken、quotetoken信息
    baseToken.tradeVolume = baseToken.tradeVolume.plus(baseTokenTradeAmount);
    quoteToken.tradeVolume = quoteToken.tradeVolume.plus(quoteTokenTradeAmount);
    baseToken.txCount = baseToken.txCount.plus(ONE_BI);
    quoteToken.txCount = quoteToken.txCount.plus(ONE_BI);

    //更新pair信息
    pair.txCount = pair.txCount.plus(ONE_BI);
    pair.volumeBaseToken = pair.volumeBaseToken.plus(baseTokenTradeAmount);
    pair.volumeQuoteToken = pair.volumeBaseToken.plus(quoteTokenTradeAmount);
    pair.save();
    //更新DodoZoo总计信息
    let dodoZoo = DodoZoo.load(DODOZoo_ADDRESS);
    dodoZoo.totalVolumeUSD = quoteTokenTradeAmount.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    dodoZoo.txCount = dodoZoo.txCount.plus(ONE_BI);

    let transaction = Transaction.load(event.transaction.hash.toHexString());
    if (transaction === null) {
        transaction = new Transaction(event.transaction.hash.toHexString());
        transaction.blockNumber = event.block.number;
        transaction.timestamp = event.block.timestamp;
        transaction.mints = [];
        transaction.swaps = [];
        transaction.burns = [];
    }

    let swaps = transaction.swaps;

    let swap = new Swap(event.transaction.hash.toHexString().concat('-').concat(BigInt.fromI32(swaps.length).toString()));
    //swap填数据
    swap.transaction = transaction.id;
    swap.pair = pair.id;
    swap.timestamp = transaction.timestamp;
    swap.sender = event.params.seller;
    swap.baseSwaped = baseTokenTradeAmount;
    swap.quoteSwaped = quoteTokenTradeAmount;
    swap.to = event.params.seller;
    swap.from = event.transaction.from;
    swap.logIndex = event.logIndex;
    swap.amountUSD = quoteTokenTradeAmount.plus(quoteTokenTradeAmount);
    swap.isSellBase = false;

    swap.save();
    swaps.push(swap.id);
    transaction.swaps = swaps;
    transaction.save();

    let pairDayData = updatePairDayData(event);
    let pairHourData = updatePairHourData(event);
    let dodoDayData = updateDodoDayData(event);
    let baseTokenDayData = updateTokenDayData(baseToken as Token, event);
    let quoteTokenData = updateTokenDayData(quoteToken as Token, event);

    dodoDayData.dailyVolumeUSD = dodoDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    dodoDayData.save();

    pairDayData.dailyVolumeBase = pairDayData.dailyVolumeBase.plus(baseTokenTradeAmount);
    pairDayData.dailyVolumeQuote = pairDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount);
    pairDayData.dailyVolumeUSD = pairDayData.dailyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    pairDayData.save();

    pairHourData.hourlyVolumeBase = pairHourData.hourlyVolumeBase.plus(baseTokenTradeAmount);
    pairHourData.hourlyVolumeQuote = pairHourData.hourlyVolumeQuote.plus(quoteTokenTradeAmount);
    pairHourData.hourlyVolumeUSD = pairHourData.hourlyVolumeUSD.plus(quoteTokenTradeAmount).plus(quoteTokenTradeAmount);
    pairHourData.save();

    baseTokenDayData.dailyVolumeToken = baseTokenDayData.dailyVolumeToken.plus(baseTokenTradeAmount);
    baseTokenDayData.dailyVolumeUSD = baseTokenDayData.totalLiquidityUSD.plus(quoteTokenTradeAmount);
    baseTokenDayData.save();

    quoteTokenData.dailyVolumeToken = quoteTokenData.dailyVolumeToken.plus(quoteTokenTradeAmount);
    quoteTokenData.dailyVolumeUSD = quoteTokenData.dailyVolumeUSD.plus(quoteTokenTradeAmount);
    quoteTokenData.save();
}
