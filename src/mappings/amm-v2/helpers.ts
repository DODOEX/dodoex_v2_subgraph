/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { ERC20 } from "../../types/amm-v2/Factory/ERC20";
import { ERC20NameBytes } from "../../types/amm-v2/Factory/ERC20NameBytes";
import { ERC20SymbolBytes } from "../../types/amm-v2/Factory/ERC20SymbolBytes";
import { LpToken, Pair, User } from "../../types/amm-v2/schema";
import { Factory as FactoryContract } from "../../types/amm-v2/templates/Pair/Factory";
import { TokenDefinition } from "./tokenDefinition";
import { BI_18, FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from "../constant";

export let factoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BI_18));
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(ZERO_BD.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  if (staticDefinition != null) {
    return (staticDefinition as TokenDefinition).symbol;
  }

  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  // try types string and bytes32 for symbol
  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  if (staticDefinition != null) {
    return (staticDefinition as TokenDefinition).name;
  }

  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  // try types string and bytes32 for name
  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }

  return nameValue;
}

// HOT FIX: we cant implement try catch for overflow catching so skip total supply parsing on these tokens that overflow
// TODO: find better way to handle overflow
let SKIP_TOTAL_SUPPLY: string[] = [
  "0x0000000000bf2686748e1c0255036e7617e7e8a5",
];

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  if (SKIP_TOTAL_SUPPLY.includes(tokenAddress.toHexString())) {
    return BigInt.fromI32(0);
  }
  const contract = ERC20.bind(tokenAddress);
  let totalSupplyValue = BigInt.zero();
  const totalSupplyResult = contract.try_totalSupply();
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value;
  }
  return totalSupplyValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt | null {
  // static definitions overrides
  let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  if (staticDefinition != null) {
    return (staticDefinition as TokenDefinition).decimals;
  }

  let contract = ERC20.bind(tokenAddress);
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    if (decimalResult.value.lt(BigInt.fromI32(255))) {
      return decimalResult.value;
    }
  }
  return null;
}

export function createUser(address: Address, timestamp: BigInt): User {
  let user = User.load(address.toHexString());
  if (user === null) {
    user = new User(address.toHexString());
    user.usdSwapped = ZERO_BD;
    user.txCount = ZERO_BI;
    user.tradingRewardRecieved = ZERO_BD;
    user.timestamp = timestamp;
  }
  user.updatedAt = timestamp;
  user.save();
  return user as User;
}

export function createLpToken(
  address: Address,
  pair: Pair,
  isUpdateTotalSupply: boolean = true
): LpToken {
  let lpToken = LpToken.load(address.toHexString());
  let decimals = fetchTokenDecimals(address);

  if (lpToken == null) {
    lpToken = new LpToken(address.toHexString());
    lpToken.decimals = ZERO_BI;
    if (decimals != null) lpToken.decimals = decimals;
    lpToken.name = fetchTokenName(address);
    lpToken.symbol = fetchTokenSymbol(address);
    lpToken.totalSupply = ZERO_BI;
    lpToken.pair = pair.id;
    lpToken.save();
  }

  //for V1 classical hardcode pools
  if (lpToken.symbol == "unknown") {
    lpToken.symbol = fetchTokenSymbol(address);
    lpToken.name = fetchTokenName(address);
    lpToken.decimals = ZERO_BI;
    if (decimals != null) lpToken.decimals = decimals;
    lpToken.save();
  }

  if (isUpdateTotalSupply || lpToken.symbol == "unknown") {
    lpToken.totalSupply = fetchTokenTotalSupply(address);
  }
  return lpToken as LpToken;
}
