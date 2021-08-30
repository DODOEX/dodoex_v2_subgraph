import {
    Transaction, Token
} from "../../types/dodoex/schema"
import {BigDecimal, ethereum} from '@graphprotocol/graph-ts'
import {increaseTxCount} from './dayUpdates'
import {ZERO_BD} from "./helpers"

export function addTransaction(event: ethereum.Event, sender: String, type: String): Transaction {
    let id = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let transaction = Transaction.load(id);
    if (transaction == null) {
        increaseTxCount(event);
        transaction = new Transaction(id);
        transaction.from = event.transaction.from.toHexString();
        transaction.to = event.transaction.to.toHexString();
        transaction.sender = sender as string;
        transaction.type = type as string;
        transaction.tokens = [];
        transaction.volumeUSD = ZERO_BD;
        transaction.timestamp = event.block.timestamp;
    } else {
        transaction.sender = transaction.sender.concat("-").concat(sender as string);
        transaction.type = transaction.type.concat("-").concat(type as string);
    }
    transaction.updatedAt = event.block.timestamp;
    transaction.save();
    return transaction as Transaction;
}

export function addToken(transaction: Transaction,token: Token): void{
    if(transaction!=null){
        transaction.tokens.push(token.id);
        transaction.save();
    }
}

export function addVolume(transaction: Transaction,volumeUSD: BigDecimal):void{
    if(transaction!=null){
        transaction.volumeUSD = transaction.volumeUSD.plus(volumeUSD);
        transaction.save();
    }
}

export function replaceVolume(transaction: Transaction,volumeUSD: BigDecimal): void{
    if(transaction!=null){
        transaction.volumeUSD = volumeUSD;
        transaction.save();
    }
}