import { Transaction, Token } from "../../types/dodoex/schema";
import { Address, BigDecimal, ethereum } from "@graphprotocol/graph-ts";
import { increaseTxCount } from "./dayUpdates";
import { ZERO_BD } from "./helpers";
import { ADDRESS_ZERO } from "../constant";

export function addTransaction(
  event: ethereum.Event,
  sender: string,
  type: string
): Transaction {
  let id = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  let transaction = Transaction.load(id);
  if (transaction == null) {
    increaseTxCount(event);
    transaction = new Transaction(id);
    transaction.from = event.transaction.from.toHexString();
    if (event.transaction.to)
      transaction.to = (event.transaction.to as Address).toHexString();
    transaction.sender = sender;
    transaction.address = event.address;
    transaction.type = type;
    transaction.tokens = [];
    transaction.volumeUSD = ZERO_BD;
    transaction.timestamp = event.block.timestamp;
  } else {
    transaction.sender = transaction.sender.concat("-").concat(sender);
    transaction.type = transaction.type.concat("-").concat(type);
  }
  transaction.updatedAt = event.block.timestamp;
  transaction.save();
  return transaction;
}

export function addToken(transaction: Transaction, token: Token): void {
  if (transaction != null && transaction.tokens != null) {
    (transaction.tokens as string[]).push(token.id);
    transaction.save();
  }
}

export function addVolume(
  transaction: Transaction,
  volumeUSD: BigDecimal
): void {
  if (transaction != null) {
    transaction.volumeUSD = transaction.volumeUSD.plus(volumeUSD);
    transaction.save();
  }
}

export function replaceVolume(
  transaction: Transaction,
  volumeUSD: BigDecimal
): void {
  if (transaction != null) {
    transaction.volumeUSD = volumeUSD;
    transaction.save();
  }
}
