import { Address, ethereum, log, BigInt } from "@graphprotocol/graph-ts";
import {
  Claimed as ClaimedEvent,
  MerkleDistributor,
} from "../../types/merkle/MerkleDistributor/MerkleDistributor";
import { ERC20 } from "../../types/merkle/MerkleDistributor/ERC20";
import { Claimed, Token } from "../../types/merkle/schema";

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

  let merkleDistributor = MerkleDistributor.bind(event.address);
  let tokenAddress = merkleDistributor.try_token();
  if (tokenAddress.reverted) {
    log.info("merkleDistributor.try_token reverted: {}", [entity.id]);
  }
  let token = createToken(tokenAddress.value, event);
  entity.token = token.id;
  entity.updatedAt = event.block.timestamp;
  entity.save();
}

function createToken(address: Address, event: ethereum.Event): Token {
  let token = Token.load(address.toHexString());
  if (token == null) {
    token = new Token(address.toHexString());
    let erc20 = ERC20.bind(address);
    token.name = erc20.name();
    token.symbol = erc20.symbol();
    token.decimals = BigInt.fromI32(erc20.decimals());
    let totalSupplyResult = erc20.try_totalSupply();
    if (totalSupplyResult.reverted) {
      log.error("ERC20.try_totalSupply reverted. address: {}", [
        address.toHexString(),
      ]);
      token.totalSupply = BigInt.fromI32(0);
    } else {
      token.totalSupply = totalSupplyResult.value;
    }
    token.updatedAt = event.block.timestamp;
    token.save();
  }
  return token as Token;
}
