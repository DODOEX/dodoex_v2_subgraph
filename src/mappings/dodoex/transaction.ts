import {
    Transaction
} from "../../types/dodoex/schema"
import {ethereum} from '@graphprotocol/graph-ts'
import {increaseTxCount} from './dayUpdates'

export function addTransaction(event: ethereum.Event, sender: String, type: String): Transaction {
    let transaction = Transaction.load(event.transaction.hash.toHexString());
    if (transaction == null) {
        increaseTxCount(event);
        transaction = new Transaction(event.transaction.hash.toHexString());
        transaction.from = event.transaction.from.toHexString();
        transaction.to = event.transaction.to.toHexString();
        transaction.sender = sender as string;
        transaction.type = type as string;
    } else {
        transaction.sender = transaction.sender.concat("-").concat(sender as string);
        transaction.type = transaction.type.concat("-").concat(type as string);
    }
    transaction.save();
    return transaction as Transaction;
}