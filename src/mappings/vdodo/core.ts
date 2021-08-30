import {BigInt, BigDecimal, ethereum, log, Address, dataSource} from '@graphprotocol/graph-ts'
import {
    User,
    MintHistory,
    RedeemHistory,
    DODO,
    vDODO,
    UserOperationHistory,
    TransferHistory,
    DonateHistory
} from "../../types/vdodo/schema"
import {
    ZERO_BD,
    ONE_BI,
    convertTokenToDecimal,
    createUser,
    fetchUserInfo,
    initTokenInfo,
    fetchTokenBalance, ZERO_BI, fetchTotalSp
} from "./helpers"
import {
    MintVDODO,
    RedeemVDODO,
    Transfer,
    PreDeposit,
    ChangePerReward,
    DonateDODO
} from "../../types/vdodo/vDODOToken/vDODOToken"
import {
    DODO_ADDRESS_KOVAN,
    DODO_ADDRESS_MAINNET
} from "./constants"

export function handleMintVDODO(event: MintVDODO): void {
    initTokenInfo();
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);

    let user = User.load(event.params.user.toHexString());
    if (user == null) {
        if (vdodo.totalUsers.equals(ZERO_BI)) {
            vdodo.totalUsers = vdodo.totalUsers.plus(ONE_BI);
        }
        vdodo.totalUsers = vdodo.totalUsers.plus(ONE_BI);
        user = createUser(event.params.user, event);
    }
    let history = MintHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));

    let userInfo = fetchUserInfo(event.params.user);
    let superiorSpChange = userInfo.value1.minus(user.superiorSP);
    let userSpChange = userInfo.value0.minus(user.stakingPower);
    user.stakingPower = userInfo.value0;
    user.superiorSP = userInfo.value1;
    user.credit = convertTokenToDecimal(userInfo.value3, dodo.decimals);
    user.superior = userInfo.value2;

    if (history == null) {
        history = new MintHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()))
        history.amount = convertTokenToDecimal(event.params.mintDODO, dodo.decimals);
        history.user = user.id;
        history.timestamp = event.block.timestamp;
    }

    let operation = UserOperationHistory.load(event.transaction.hash.toHexString());
    if (operation == null) {
        operation = new UserOperationHistory(event.transaction.hash.toHexString());
        operation.amount = ZERO_BD;
        operation.timestamp = event.block.timestamp;
        operation.type = "MINT";
        operation.user = user.id;
        operation.superiorSpChange = ZERO_BI;
        operation.superiorCreditChange = ZERO_BD;
    }

    let superiorUserInfo = fetchUserInfo(Address.fromString(user.superior.toHexString()));
    let superior = createUser(Address.fromString(user.superior.toHexString()), event)

    let superiorCreditChange = convertTokenToDecimal(superiorUserInfo.value3, dodo.decimals).minus(superior.credit);

    superior.stakingPower = superiorUserInfo.value0;
    superior.superiorSP = superiorUserInfo.value1;
    superior.credit = convertTokenToDecimal(superiorUserInfo.value3, dodo.decimals);
    superior.superior = superiorUserInfo.value2;
    superior.spFromInvited = superior.spFromInvited.plus(superiorSpChange);
    superior.creditFromInvited = superior.creditFromInvited.plus(superiorCreditChange);

    operation.superiorSpChange = superiorSpChange;
    operation.superiorCreditChange = superiorCreditChange;
    operation.amount = operation.amount.plus(convertTokenToDecimal(event.params.mintDODO, dodo.decimals));

    vdodo.mintAmount = vdodo.mintAmount.plus(convertTokenToDecimal(event.params.mintDODO, dodo.decimals));
    user.mintAmount = user.mintAmount.plus(convertTokenToDecimal(event.params.mintDODO, dodo.decimals));
    user.creditOfSuperior = user.creditOfSuperior.plus(superiorCreditChange);
    vdodo.dodoBalance = convertTokenToDecimal(fetchTokenBalance(Address.fromString(DODO_ADDRESS), dataSource.address()), dodo.decimals);
    vdodo.totalStakingPower = fetchTotalSp();

    superior.save();
    vdodo.save();
    operation.save();
    history.save();
    history.save();
    user.save();
}

export function handleRedeemVDODO(event: RedeemVDODO): void {
    initTokenInfo();
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);

    let user = User.load(event.params.user.toHexString());
    if (user == null) {
        vdodo.totalUsers = vdodo.totalUsers.plus(ONE_BI);
        user = createUser(event.params.user, event);
    }

    let history = RedeemHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));

    let userInfo = fetchUserInfo(event.params.user);
    let superiorSpChange = userInfo.value1.minus(user.superiorSP);
    let userSpChange = userInfo.value0.minus(user.stakingPower);
    user.stakingPower = userInfo.value0;
    user.superiorSP = userInfo.value1;
    user.credit = convertTokenToDecimal(userInfo.value3, dodo.decimals);
    user.superior = userInfo.value2;

    if (history == null) {
        history = new RedeemHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()))
        history.recieve = convertTokenToDecimal(event.params.receiveDODO, dodo.decimals);
        history.burn = convertTokenToDecimal(event.params.burnDODO, dodo.decimals);
        history.fee = convertTokenToDecimal(event.params.feeDODO, dodo.decimals);
        history.user = user.id;
        history.timestamp = event.block.timestamp;
    }

    let operation = UserOperationHistory.load(event.transaction.hash.toHexString());
    if (operation == null) {
        operation = new UserOperationHistory(event.transaction.hash.toHexString());
        operation.amount = ZERO_BD;
        operation.timestamp = event.block.timestamp;
        operation.type = "REDEEM";
        operation.user = user.id;
        operation.superiorSpChange = ZERO_BI;
        operation.superiorCreditChange = ZERO_BD;
    }

    let superiorUserInfo = fetchUserInfo(Address.fromString(user.superior.toHexString()));
    let superior = createUser(Address.fromString(user.superior.toHexString()), event)
    let superiorCreditChange = convertTokenToDecimal(superiorUserInfo.value3, dodo.decimals).minus(superior.credit);

    superior.stakingPower = superiorUserInfo.value0;
    superior.superiorSP = superiorUserInfo.value1;
    superior.credit = convertTokenToDecimal(superiorUserInfo.value3, dodo.decimals);
    superior.superior = superiorUserInfo.value2;
    superior.spFromInvited = superior.spFromInvited.plus(superiorSpChange);
    superior.creditFromInvited = superior.creditFromInvited.plus(superiorCreditChange);

    operation.superiorSpChange = superiorSpChange;
    operation.superiorCreditChange = superiorCreditChange;
    operation.amount = operation.amount.plus(convertTokenToDecimal(event.params.receiveDODO, dodo.decimals));

    vdodo.redeemAmount = vdodo.redeemAmount.plus(convertTokenToDecimal(event.params.receiveDODO, dodo.decimals));
    user.redeemRecieveAmount = user.redeemRecieveAmount.plus(convertTokenToDecimal(event.params.receiveDODO, dodo.decimals));
    user.redeemFeeAmount = user.redeemFeeAmount.plus(convertTokenToDecimal(event.params.feeDODO, dodo.decimals));
    user.redeemBurnAmount = user.redeemBurnAmount.plus(convertTokenToDecimal(event.params.burnDODO, dodo.decimals));
    user.creditOfSuperior = user.creditOfSuperior.plus(superiorCreditChange);
    vdodo.dodoBalance = convertTokenToDecimal(fetchTokenBalance(Address.fromString(DODO_ADDRESS), dataSource.address()), dodo.decimals);
    vdodo.totalStakingPower = fetchTotalSp();
    vdodo.feeAmount = vdodo.feeAmount.plus(convertTokenToDecimal(event.params.feeDODO, dodo.decimals));
    vdodo.burnAmount = vdodo.feeAmount.plus(convertTokenToDecimal(event.params.burnDODO, dodo.decimals));

    superior.save();
    vdodo.save();
    operation.save();
    history.save();
    history.save();
    user.save();
}

export function handlePreDeposit(event: PreDeposit): void {
    initTokenInfo();
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);
    vdodo.totalBlockReward = vdodo.totalBlockReward.plus(convertTokenToDecimal(event.params.dodoAmount, dodo.decimals));
    vdodo.save();
}

export function handleChangePerReward(event: ChangePerReward): void {
    initTokenInfo();
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);

    vdodo.dodoPerBlock = convertTokenToDecimal(event.params.dodoPerBlock, dodo.decimals);
    vdodo.save();
}

export function handleTransfer(event: Transfer): void {
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);

    let fromUser = createUser(event.params.from, event);
    let toUser = createUser(event.params.to, event);
    let fromUserInfo = fetchUserInfo(event.params.from);
    let toUserInfo = fetchUserInfo(event.params.to);
    let spChangeFrom = fromUserInfo.value0.minus(fromUser.stakingPower);
    let spChangeTo = toUserInfo.value0.minus(toUser.stakingPower);

    fromUser.stakingPower = fromUserInfo.value0;
    fromUser.superiorSP = fromUserInfo.value1;
    fromUser.credit = convertTokenToDecimal(fromUserInfo.value3, dodo.decimals);

    toUser.stakingPower = toUserInfo.value0;
    toUser.superiorSP = toUserInfo.value1;
    toUser.credit = convertTokenToDecimal(toUserInfo.value3, dodo.decimals);

    let fromUserSuperior = createUser(Address.fromString(fromUser.superior.toHexString()), event);
    let toUserSuperior = createUser(Address.fromString(toUser.superior.toHexString()), event);
    let fromUserSuperiorInfo = fetchUserInfo(Address.fromString(fromUser.superior.toHexString()));
    let toUserSuperiorInfo = fetchUserInfo(Address.fromString(toUser.superior.toHexString()));
    let spChangeFromUserSuperior = fromUserSuperiorInfo.value0.minus(fromUserSuperior.stakingPower);
    let spChangeToUserSuperior = toUserSuperiorInfo.value0.minus(toUserSuperior.stakingPower);
    let creditChangeFromUserSuperior = convertTokenToDecimal(fromUserSuperiorInfo.value3, dodo.decimals).minus(fromUserSuperior.credit);
    let creditChangeToUserSuperior = convertTokenToDecimal(toUserSuperiorInfo.value3, dodo.decimals).minus(toUserSuperior.credit);

    fromUserSuperior.stakingPower = fromUserSuperiorInfo.value0;
    fromUserSuperior.credit = convertTokenToDecimal(fromUserSuperiorInfo.value3, dodo.decimals);
    fromUserSuperior.spFromInvited = fromUserSuperior.spFromInvited.plus(spChangeToUserSuperior);
    fromUserSuperior.creditFromInvited = fromUserSuperior.creditFromInvited.plus(creditChangeFromUserSuperior);

    toUserSuperior.stakingPower = toUserSuperiorInfo.value0;
    toUserSuperior.credit = convertTokenToDecimal(toUserSuperiorInfo.value3, dodo.decimals);
    toUserSuperior.spFromInvited = toUserSuperior.spFromInvited.plus(spChangeFromUserSuperior);
    toUserSuperior.creditFromInvited = toUserSuperior.creditFromInvited.plus(creditChangeToUserSuperior);

    fromUser.creditOfSuperior = fromUser.creditOfSuperior.plus(creditChangeFromUserSuperior);
    fromUser.redeemRecieveAmount = fromUser.redeemRecieveAmount.plus(convertTokenToDecimal(event.params.amount,vdodo.decimals).times(BigDecimal.fromString("100")))
    toUser.creditOfSuperior = toUser.creditOfSuperior.plus(creditChangeToUserSuperior);
    toUser.mintAmount = toUser.mintAmount.plus(convertTokenToDecimal(event.params.amount,vdodo.decimals).times(BigDecimal.fromString("100")))

    fromUser.save();
    toUser.save();
    fromUserSuperior.save();
    toUserSuperior.save();

    let transferHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString());
    let transferHistory = TransferHistory.load(transferHistoryID);
    if (transferHistory == null) {
        transferHistory = new TransferHistory(transferHistoryID);
        transferHistory.from = event.params.from;
        transferHistory.to = event.params.to;
        transferHistory.amount = convertTokenToDecimal(event.params.amount, vdodo.decimals);
    }

    transferHistory.save();
}

export function handleDonateDODO(event: DonateDODO): void {
    initTokenInfo();
    let vdodo = vDODO.load(dataSource.address().toHexString());
    let DODO_ADDRESS = dataSource.network() == "mainnet" ? DODO_ADDRESS_MAINNET : DODO_ADDRESS_KOVAN;
    let dodo = DODO.load(DODO_ADDRESS);

    let donateHistoryID = event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString())
    let donateHistory = DonateHistory.load(donateHistoryID);

    if (donateHistory == null) {
        donateHistory = new DonateHistory(donateHistoryID);
        donateHistory.donor = event.params.user;
        donateHistory.dodoAmount = convertTokenToDecimal(event.params.donateDODO,dodo.decimals);
        donateHistory.blockNumber = event.block.number;
        donateHistory.timestamp = event.block.timestamp;
        donateHistory.save();
    }

}
