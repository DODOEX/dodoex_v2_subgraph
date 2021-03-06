// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OrderHistory extends ethereum.Event {
  get params(): OrderHistory__Params {
    return new OrderHistory__Params(this);
  }
}

export class OrderHistory__Params {
  _event: OrderHistory;

  constructor(event: OrderHistory) {
    this._event = event;
  }

  get fromToken(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get toToken(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get fromAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get returnAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class OwnershipTransferPrepared extends ethereum.Event {
  get params(): OwnershipTransferPrepared__Params {
    return new OwnershipTransferPrepared__Params(this);
  }
}

export class OwnershipTransferPrepared__Params {
  _event: OwnershipTransferPrepared;

  constructor(event: OwnershipTransferPrepared) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class DODOV2Proxy01 extends ethereum.SmartContract {
  static bind(address: Address): DODOV2Proxy01 {
    return new DODOV2Proxy01("DODOV2Proxy01", address);
  }

  _CHI_TOKEN_(): Address {
    let result = super.call("_CHI_TOKEN_", "_CHI_TOKEN_():(address)", []);

    return result[0].toAddress();
  }

  try__CHI_TOKEN_(): ethereum.CallResult<Address> {
    let result = super.tryCall("_CHI_TOKEN_", "_CHI_TOKEN_():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _CP_FACTORY_(): Address {
    let result = super.call("_CP_FACTORY_", "_CP_FACTORY_():(address)", []);

    return result[0].toAddress();
  }

  try__CP_FACTORY_(): ethereum.CallResult<Address> {
    let result = super.tryCall("_CP_FACTORY_", "_CP_FACTORY_():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _DODO_APPROVE_(): Address {
    let result = super.call("_DODO_APPROVE_", "_DODO_APPROVE_():(address)", []);

    return result[0].toAddress();
  }

  try__DODO_APPROVE_(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "_DODO_APPROVE_",
      "_DODO_APPROVE_():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _DODO_INCENTIVE_(): Address {
    let result = super.call(
      "_DODO_INCENTIVE_",
      "_DODO_INCENTIVE_():(address)",
      []
    );

    return result[0].toAddress();
  }

  try__DODO_INCENTIVE_(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "_DODO_INCENTIVE_",
      "_DODO_INCENTIVE_():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _DODO_SELL_HELPER_(): Address {
    let result = super.call(
      "_DODO_SELL_HELPER_",
      "_DODO_SELL_HELPER_():(address)",
      []
    );

    return result[0].toAddress();
  }

  try__DODO_SELL_HELPER_(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "_DODO_SELL_HELPER_",
      "_DODO_SELL_HELPER_():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _DPP_FACTORY_(): Address {
    let result = super.call("_DPP_FACTORY_", "_DPP_FACTORY_():(address)", []);

    return result[0].toAddress();
  }

  try__DPP_FACTORY_(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "_DPP_FACTORY_",
      "_DPP_FACTORY_():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _DVM_FACTORY_(): Address {
    let result = super.call("_DVM_FACTORY_", "_DVM_FACTORY_():(address)", []);

    return result[0].toAddress();
  }

  try__DVM_FACTORY_(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "_DVM_FACTORY_",
      "_DVM_FACTORY_():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _GAS_DODO_MAX_RETURN_(): BigInt {
    let result = super.call(
      "_GAS_DODO_MAX_RETURN_",
      "_GAS_DODO_MAX_RETURN_():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try__GAS_DODO_MAX_RETURN_(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "_GAS_DODO_MAX_RETURN_",
      "_GAS_DODO_MAX_RETURN_():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  _GAS_EXTERNAL_RETURN_(): BigInt {
    let result = super.call(
      "_GAS_EXTERNAL_RETURN_",
      "_GAS_EXTERNAL_RETURN_():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try__GAS_EXTERNAL_RETURN_(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "_GAS_EXTERNAL_RETURN_",
      "_GAS_EXTERNAL_RETURN_():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  _NEW_OWNER_(): Address {
    let result = super.call("_NEW_OWNER_", "_NEW_OWNER_():(address)", []);

    return result[0].toAddress();
  }

  try__NEW_OWNER_(): ethereum.CallResult<Address> {
    let result = super.tryCall("_NEW_OWNER_", "_NEW_OWNER_():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _OWNER_(): Address {
    let result = super.call("_OWNER_", "_OWNER_():(address)", []);

    return result[0].toAddress();
  }

  try__OWNER_(): ethereum.CallResult<Address> {
    let result = super.tryCall("_OWNER_", "_OWNER_():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  _WETH_(): Address {
    let result = super.call("_WETH_", "_WETH_():(address)", []);

    return result[0].toAddress();
  }

  try__WETH_(): ethereum.CallResult<Address> {
    let result = super.tryCall("_WETH_", "_WETH_():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isWhiteListed(param0: Address): boolean {
    let result = super.call("isWhiteListed", "isWhiteListed(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBoolean();
  }

  try_isWhiteListed(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isWhiteListed",
      "isWhiteListed(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  dodoSwapV2TokenToETH(
    fromToken: Address,
    fromTokenAmount: BigInt,
    minReturnAmount: BigInt,
    dodoPairs: Array<Address>,
    directions: BigInt,
    isIncentive: boolean,
    deadLine: BigInt
  ): BigInt {
    let result = super.call(
      "dodoSwapV2TokenToETH",
      "dodoSwapV2TokenToETH(address,uint256,uint256,address[],uint256,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(fromToken),
        ethereum.Value.fromUnsignedBigInt(fromTokenAmount),
        ethereum.Value.fromUnsignedBigInt(minReturnAmount),
        ethereum.Value.fromAddressArray(dodoPairs),
        ethereum.Value.fromUnsignedBigInt(directions),
        ethereum.Value.fromBoolean(isIncentive),
        ethereum.Value.fromUnsignedBigInt(deadLine)
      ]
    );

    return result[0].toBigInt();
  }

  try_dodoSwapV2TokenToETH(
    fromToken: Address,
    fromTokenAmount: BigInt,
    minReturnAmount: BigInt,
    dodoPairs: Array<Address>,
    directions: BigInt,
    isIncentive: boolean,
    deadLine: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "dodoSwapV2TokenToETH",
      "dodoSwapV2TokenToETH(address,uint256,uint256,address[],uint256,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(fromToken),
        ethereum.Value.fromUnsignedBigInt(fromTokenAmount),
        ethereum.Value.fromUnsignedBigInt(minReturnAmount),
        ethereum.Value.fromAddressArray(dodoPairs),
        ethereum.Value.fromUnsignedBigInt(directions),
        ethereum.Value.fromBoolean(isIncentive),
        ethereum.Value.fromUnsignedBigInt(deadLine)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  dodoSwapV2TokenToToken(
    fromToken: Address,
    toToken: Address,
    fromTokenAmount: BigInt,
    minReturnAmount: BigInt,
    dodoPairs: Array<Address>,
    directions: BigInt,
    isIncentive: boolean,
    deadLine: BigInt
  ): BigInt {
    let result = super.call(
      "dodoSwapV2TokenToToken",
      "dodoSwapV2TokenToToken(address,address,uint256,uint256,address[],uint256,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(fromToken),
        ethereum.Value.fromAddress(toToken),
        ethereum.Value.fromUnsignedBigInt(fromTokenAmount),
        ethereum.Value.fromUnsignedBigInt(minReturnAmount),
        ethereum.Value.fromAddressArray(dodoPairs),
        ethereum.Value.fromUnsignedBigInt(directions),
        ethereum.Value.fromBoolean(isIncentive),
        ethereum.Value.fromUnsignedBigInt(deadLine)
      ]
    );

    return result[0].toBigInt();
  }

  try_dodoSwapV2TokenToToken(
    fromToken: Address,
    toToken: Address,
    fromTokenAmount: BigInt,
    minReturnAmount: BigInt,
    dodoPairs: Array<Address>,
    directions: BigInt,
    isIncentive: boolean,
    deadLine: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "dodoSwapV2TokenToToken",
      "dodoSwapV2TokenToToken(address,address,uint256,uint256,address[],uint256,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(fromToken),
        ethereum.Value.fromAddress(toToken),
        ethereum.Value.fromUnsignedBigInt(fromTokenAmount),
        ethereum.Value.fromUnsignedBigInt(minReturnAmount),
        ethereum.Value.fromAddressArray(dodoPairs),
        ethereum.Value.fromUnsignedBigInt(directions),
        ethereum.Value.fromBoolean(isIncentive),
        ethereum.Value.fromUnsignedBigInt(deadLine)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get dvmFactory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get dppFactory(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get cpFactory(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get weth(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get dodoApprove(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get dodoSellHelper(): Address {
    return this._call.inputValues[5].value.toAddress();
  }

  get chiToken(): Address {
    return this._call.inputValues[6].value.toAddress();
  }

  get dodoIncentive(): Address {
    return this._call.inputValues[7].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DefaultCall extends ethereum.Call {
  get inputs(): DefaultCall__Inputs {
    return new DefaultCall__Inputs(this);
  }

  get outputs(): DefaultCall__Outputs {
    return new DefaultCall__Outputs(this);
  }
}

export class DefaultCall__Inputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DefaultCall__Outputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class ClaimOwnershipCall extends ethereum.Call {
  get inputs(): ClaimOwnershipCall__Inputs {
    return new ClaimOwnershipCall__Inputs(this);
  }

  get outputs(): ClaimOwnershipCall__Outputs {
    return new ClaimOwnershipCall__Outputs(this);
  }
}

export class ClaimOwnershipCall__Inputs {
  _call: ClaimOwnershipCall;

  constructor(call: ClaimOwnershipCall) {
    this._call = call;
  }
}

export class ClaimOwnershipCall__Outputs {
  _call: ClaimOwnershipCall;

  constructor(call: ClaimOwnershipCall) {
    this._call = call;
  }
}

export class InitOwnerCall extends ethereum.Call {
  get inputs(): InitOwnerCall__Inputs {
    return new InitOwnerCall__Inputs(this);
  }

  get outputs(): InitOwnerCall__Outputs {
    return new InitOwnerCall__Outputs(this);
  }
}

export class InitOwnerCall__Inputs {
  _call: InitOwnerCall;

  constructor(call: InitOwnerCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitOwnerCall__Outputs {
  _call: InitOwnerCall;

  constructor(call: InitOwnerCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class AddWhiteListCall extends ethereum.Call {
  get inputs(): AddWhiteListCall__Inputs {
    return new AddWhiteListCall__Inputs(this);
  }

  get outputs(): AddWhiteListCall__Outputs {
    return new AddWhiteListCall__Outputs(this);
  }
}

export class AddWhiteListCall__Inputs {
  _call: AddWhiteListCall;

  constructor(call: AddWhiteListCall) {
    this._call = call;
  }

  get contractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddWhiteListCall__Outputs {
  _call: AddWhiteListCall;

  constructor(call: AddWhiteListCall) {
    this._call = call;
  }
}

export class RemoveWhiteListCall extends ethereum.Call {
  get inputs(): RemoveWhiteListCall__Inputs {
    return new RemoveWhiteListCall__Inputs(this);
  }

  get outputs(): RemoveWhiteListCall__Outputs {
    return new RemoveWhiteListCall__Outputs(this);
  }
}

export class RemoveWhiteListCall__Inputs {
  _call: RemoveWhiteListCall;

  constructor(call: RemoveWhiteListCall) {
    this._call = call;
  }

  get contractAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveWhiteListCall__Outputs {
  _call: RemoveWhiteListCall;

  constructor(call: RemoveWhiteListCall) {
    this._call = call;
  }
}

export class UpdateGasReturnCall extends ethereum.Call {
  get inputs(): UpdateGasReturnCall__Inputs {
    return new UpdateGasReturnCall__Inputs(this);
  }

  get outputs(): UpdateGasReturnCall__Outputs {
    return new UpdateGasReturnCall__Outputs(this);
  }
}

export class UpdateGasReturnCall__Inputs {
  _call: UpdateGasReturnCall;

  constructor(call: UpdateGasReturnCall) {
    this._call = call;
  }

  get newDodoGasReturn(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get newExternalGasReturn(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UpdateGasReturnCall__Outputs {
  _call: UpdateGasReturnCall;

  constructor(call: UpdateGasReturnCall) {
    this._call = call;
  }
}

export class CreateDODOVendingMachineCall extends ethereum.Call {
  get inputs(): CreateDODOVendingMachineCall__Inputs {
    return new CreateDODOVendingMachineCall__Inputs(this);
  }

  get outputs(): CreateDODOVendingMachineCall__Outputs {
    return new CreateDODOVendingMachineCall__Outputs(this);
  }
}

export class CreateDODOVendingMachineCall__Inputs {
  _call: CreateDODOVendingMachineCall;

  constructor(call: CreateDODOVendingMachineCall) {
    this._call = call;
  }

  get baseToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get quoteToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get baseInAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get quoteInAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get lpFeeRate(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get i(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get k(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get isOpenTWAP(): boolean {
    return this._call.inputValues[7].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[8].value.toBigInt();
  }
}

export class CreateDODOVendingMachineCall__Outputs {
  _call: CreateDODOVendingMachineCall;

  constructor(call: CreateDODOVendingMachineCall) {
    this._call = call;
  }

  get newVendingMachine(): Address {
    return this._call.outputValues[0].value.toAddress();
  }

  get shares(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }
}

export class AddDVMLiquidityCall extends ethereum.Call {
  get inputs(): AddDVMLiquidityCall__Inputs {
    return new AddDVMLiquidityCall__Inputs(this);
  }

  get outputs(): AddDVMLiquidityCall__Outputs {
    return new AddDVMLiquidityCall__Outputs(this);
  }
}

export class AddDVMLiquidityCall__Inputs {
  _call: AddDVMLiquidityCall;

  constructor(call: AddDVMLiquidityCall) {
    this._call = call;
  }

  get dvmAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get baseInAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get quoteInAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get baseMinAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get quoteMinAmount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get flag(): i32 {
    return this._call.inputValues[5].value.toI32();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class AddDVMLiquidityCall__Outputs {
  _call: AddDVMLiquidityCall;

  constructor(call: AddDVMLiquidityCall) {
    this._call = call;
  }

  get shares(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }

  get baseAdjustedInAmount(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }

  get quoteAdjustedInAmount(): BigInt {
    return this._call.outputValues[2].value.toBigInt();
  }
}

export class CreateDODOPrivatePoolCall extends ethereum.Call {
  get inputs(): CreateDODOPrivatePoolCall__Inputs {
    return new CreateDODOPrivatePoolCall__Inputs(this);
  }

  get outputs(): CreateDODOPrivatePoolCall__Outputs {
    return new CreateDODOPrivatePoolCall__Outputs(this);
  }
}

export class CreateDODOPrivatePoolCall__Inputs {
  _call: CreateDODOPrivatePoolCall;

  constructor(call: CreateDODOPrivatePoolCall) {
    this._call = call;
  }

  get baseToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get quoteToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get baseInAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get quoteInAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get lpFeeRate(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get i(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get k(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get isOpenTwap(): boolean {
    return this._call.inputValues[7].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[8].value.toBigInt();
  }
}

export class CreateDODOPrivatePoolCall__Outputs {
  _call: CreateDODOPrivatePoolCall;

  constructor(call: CreateDODOPrivatePoolCall) {
    this._call = call;
  }

  get newPrivatePool(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class ResetDODOPrivatePoolCall extends ethereum.Call {
  get inputs(): ResetDODOPrivatePoolCall__Inputs {
    return new ResetDODOPrivatePoolCall__Inputs(this);
  }

  get outputs(): ResetDODOPrivatePoolCall__Outputs {
    return new ResetDODOPrivatePoolCall__Outputs(this);
  }
}

export class ResetDODOPrivatePoolCall__Inputs {
  _call: ResetDODOPrivatePoolCall;

  constructor(call: ResetDODOPrivatePoolCall) {
    this._call = call;
  }

  get dppAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get paramList(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get amountList(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get flag(): i32 {
    return this._call.inputValues[3].value.toI32();
  }

  get minBaseReserve(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get minQuoteReserve(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class ResetDODOPrivatePoolCall__Outputs {
  _call: ResetDODOPrivatePoolCall;

  constructor(call: ResetDODOPrivatePoolCall) {
    this._call = call;
  }
}

export class DodoSwapV2ETHToTokenCall extends ethereum.Call {
  get inputs(): DodoSwapV2ETHToTokenCall__Inputs {
    return new DodoSwapV2ETHToTokenCall__Inputs(this);
  }

  get outputs(): DodoSwapV2ETHToTokenCall__Outputs {
    return new DodoSwapV2ETHToTokenCall__Outputs(this);
  }
}

export class DodoSwapV2ETHToTokenCall__Inputs {
  _call: DodoSwapV2ETHToTokenCall;

  constructor(call: DodoSwapV2ETHToTokenCall) {
    this._call = call;
  }

  get toToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get dodoPairs(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }

  get directions(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class DodoSwapV2ETHToTokenCall__Outputs {
  _call: DodoSwapV2ETHToTokenCall;

  constructor(call: DodoSwapV2ETHToTokenCall) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class DodoSwapV2TokenToETHCall extends ethereum.Call {
  get inputs(): DodoSwapV2TokenToETHCall__Inputs {
    return new DodoSwapV2TokenToETHCall__Inputs(this);
  }

  get outputs(): DodoSwapV2TokenToETHCall__Outputs {
    return new DodoSwapV2TokenToETHCall__Outputs(this);
  }
}

export class DodoSwapV2TokenToETHCall__Inputs {
  _call: DodoSwapV2TokenToETHCall;

  constructor(call: DodoSwapV2TokenToETHCall) {
    this._call = call;
  }

  get fromToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get fromTokenAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get dodoPairs(): Array<Address> {
    return this._call.inputValues[3].value.toAddressArray();
  }

  get directions(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[5].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class DodoSwapV2TokenToETHCall__Outputs {
  _call: DodoSwapV2TokenToETHCall;

  constructor(call: DodoSwapV2TokenToETHCall) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class DodoSwapV2TokenToTokenCall extends ethereum.Call {
  get inputs(): DodoSwapV2TokenToTokenCall__Inputs {
    return new DodoSwapV2TokenToTokenCall__Inputs(this);
  }

  get outputs(): DodoSwapV2TokenToTokenCall__Outputs {
    return new DodoSwapV2TokenToTokenCall__Outputs(this);
  }
}

export class DodoSwapV2TokenToTokenCall__Inputs {
  _call: DodoSwapV2TokenToTokenCall;

  constructor(call: DodoSwapV2TokenToTokenCall) {
    this._call = call;
  }

  get fromToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get fromTokenAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get dodoPairs(): Array<Address> {
    return this._call.inputValues[4].value.toAddressArray();
  }

  get directions(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[6].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class DodoSwapV2TokenToTokenCall__Outputs {
  _call: DodoSwapV2TokenToTokenCall;

  constructor(call: DodoSwapV2TokenToTokenCall) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ExternalSwapCall extends ethereum.Call {
  get inputs(): ExternalSwapCall__Inputs {
    return new ExternalSwapCall__Inputs(this);
  }

  get outputs(): ExternalSwapCall__Outputs {
    return new ExternalSwapCall__Outputs(this);
  }
}

export class ExternalSwapCall__Inputs {
  _call: ExternalSwapCall;

  constructor(call: ExternalSwapCall) {
    this._call = call;
  }

  get fromToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get approveTarget(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get swapTarget(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get fromTokenAmount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get callDataConcat(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[7].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[8].value.toBigInt();
  }
}

export class ExternalSwapCall__Outputs {
  _call: ExternalSwapCall;

  constructor(call: ExternalSwapCall) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class DodoSwapV1Call extends ethereum.Call {
  get inputs(): DodoSwapV1Call__Inputs {
    return new DodoSwapV1Call__Inputs(this);
  }

  get outputs(): DodoSwapV1Call__Outputs {
    return new DodoSwapV1Call__Outputs(this);
  }
}

export class DodoSwapV1Call__Inputs {
  _call: DodoSwapV1Call;

  constructor(call: DodoSwapV1Call) {
    this._call = call;
  }

  get fromToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get fromTokenAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get dodoPairs(): Array<Address> {
    return this._call.inputValues[4].value.toAddressArray();
  }

  get directions(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[6].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }
}

export class DodoSwapV1Call__Outputs {
  _call: DodoSwapV1Call;

  constructor(call: DodoSwapV1Call) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class MixSwapCall extends ethereum.Call {
  get inputs(): MixSwapCall__Inputs {
    return new MixSwapCall__Inputs(this);
  }

  get outputs(): MixSwapCall__Outputs {
    return new MixSwapCall__Outputs(this);
  }
}

export class MixSwapCall__Inputs {
  _call: MixSwapCall;

  constructor(call: MixSwapCall) {
    this._call = call;
  }

  get fromToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get fromTokenAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get minReturnAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get mixAdapters(): Array<Address> {
    return this._call.inputValues[4].value.toAddressArray();
  }

  get mixPairs(): Array<Address> {
    return this._call.inputValues[5].value.toAddressArray();
  }

  get assetTo(): Array<Address> {
    return this._call.inputValues[6].value.toAddressArray();
  }

  get directions(): BigInt {
    return this._call.inputValues[7].value.toBigInt();
  }

  get isIncentive(): boolean {
    return this._call.inputValues[8].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[9].value.toBigInt();
  }
}

export class MixSwapCall__Outputs {
  _call: MixSwapCall;

  constructor(call: MixSwapCall) {
    this._call = call;
  }

  get returnAmount(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class CreateCrowdPoolingCall extends ethereum.Call {
  get inputs(): CreateCrowdPoolingCall__Inputs {
    return new CreateCrowdPoolingCall__Inputs(this);
  }

  get outputs(): CreateCrowdPoolingCall__Outputs {
    return new CreateCrowdPoolingCall__Outputs(this);
  }
}

export class CreateCrowdPoolingCall__Inputs {
  _call: CreateCrowdPoolingCall;

  constructor(call: CreateCrowdPoolingCall) {
    this._call = call;
  }

  get baseToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get quoteToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get baseInAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get timeLine(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get valueList(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get isOpenTWAP(): boolean {
    return this._call.inputValues[5].value.toBoolean();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class CreateCrowdPoolingCall__Outputs {
  _call: CreateCrowdPoolingCall;

  constructor(call: CreateCrowdPoolingCall) {
    this._call = call;
  }

  get newCrowdPooling(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class BidCall extends ethereum.Call {
  get inputs(): BidCall__Inputs {
    return new BidCall__Inputs(this);
  }

  get outputs(): BidCall__Outputs {
    return new BidCall__Outputs(this);
  }
}

export class BidCall__Inputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }

  get cpAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get quoteAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get flag(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class BidCall__Outputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }
}

export class AddLiquidityToV1Call extends ethereum.Call {
  get inputs(): AddLiquidityToV1Call__Inputs {
    return new AddLiquidityToV1Call__Inputs(this);
  }

  get outputs(): AddLiquidityToV1Call__Outputs {
    return new AddLiquidityToV1Call__Outputs(this);
  }
}

export class AddLiquidityToV1Call__Inputs {
  _call: AddLiquidityToV1Call;

  constructor(call: AddLiquidityToV1Call) {
    this._call = call;
  }

  get pair(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get baseAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get quoteAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get baseMinShares(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get quoteMinShares(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get flag(): i32 {
    return this._call.inputValues[5].value.toI32();
  }

  get deadLine(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class AddLiquidityToV1Call__Outputs {
  _call: AddLiquidityToV1Call;

  constructor(call: AddLiquidityToV1Call) {
    this._call = call;
  }

  get baseShares(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }

  get quoteShares(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }
}
