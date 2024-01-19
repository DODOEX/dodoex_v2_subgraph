import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../types/dpoint/LockedTokenVaultFactory/ERC20";
import { Claimed, Token } from "../../types/dpoint/schema";
import { LockedTokenVault } from "../../types/dpoint/templates";
import { Claim as ClaimEvent } from "../../types/dpoint/templates/LockedTokenVault/LockedTokenVault";

export function handleClaim(event: ClaimEvent): void {
  let entity = new Claimed(
    event.transaction.hash.toHexString().concat(event.logIndex.toString())
  );
  entity.hash = event.transaction.hash.toHexString();
  entity.logIndex = event.logIndex.toI32();
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.account = event.params.holder;
  entity.amount = event.params.amount;
  entity.originAmount = event.params.origin;
  entity.claimedAmount = event.params.claimed;
  entity.address = event.address;
  
  let lockedTokenVault = LockedTokenVault.bind(event.address);
  let tokenAddress = lockedTokenVault.try__TOKEN_();
  if (tokenAddress.reverted) {
    log.info("lockedTokenVault.try__TOKEN_ reverted: {}", [entity.id]);
  }
  let token = createToken(tokenAddress.value, event);
  entity.token = token.id;

  entity.remainingRatio = lockedTokenVault.getRemainingRatio();

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