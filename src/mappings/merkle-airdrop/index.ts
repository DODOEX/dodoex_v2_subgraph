import { Claimed as ClaimedEvent } from "../../types/merkle/MerkleDistributor/MerkleDistributor";
import { Claimed } from "../../types/merkle/schema";

export function handleClaimed(event: ClaimedEvent): void {
  let entity = new Claimed(
    event.transaction.hash.toHexString().concat(event.logIndex.toString())
  );
  entity.hash = event.transaction.hash.toHexString();
  entity.logIndex = event.logIndex.toI32();
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.account = event.params.account;
  entity.amount = event.params.amount;
  entity.index = event.params.index;
  entity.address = event.address;
  entity.updatedAt = event.block.timestamp;
  entity.save();
}
