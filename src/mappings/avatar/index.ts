import {
    AvatarMintHistory,
    AvatarDecomposeHistory,
    AvatarBalance,
    AvatarTransferHistory,
    ComponentMintHistory,
    ComponentBurnHistory,
    ComponentTransferHistory,
    ComponentBalance
} from "../../types/avatar/schema"
import {getAvatar, getAvatarBalance, getComponent, getComponentBalance} from "./helper"
import {SyntheticLog, DecomposeLog, Transfer} from "../../types/avatar/DODOAvatarERC721/DODOAvatarERC721"
import {
    ComponentMint,
    ComponentBurn,
    TransferSingle,
    TransferBatch
} from "../../types/avatar/DODOAvatarERC1155/DODOAvatarERC1155"
import {ADDRESS_ZERO, ONE_BI, ZERO_BI} from "../utils/helper";

export function handleSyntheticLog(event: SyntheticLog): void {
    let avatar = getAvatar(event.params.tokenId);
    avatar.componentsID = event.params.componentsId;
    avatar.balance = ONE_BI;
    avatar.save();

    let avatarBalance = getAvatarBalance(event.params.user, event.params.tokenId);
    avatarBalance.amount = ONE_BI;
    avatarBalance.save();

    let avatarMintHistory = AvatarMintHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (avatarMintHistory == null) {
        avatarMintHistory = new AvatarMintHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        avatarMintHistory.hash = event.transaction.hash;
        avatarMintHistory.avatar = avatar.id;
        avatarMintHistory.user = event.params.user;
        avatarMintHistory.save();
    }

}

export function handleDecomposeLog(event: DecomposeLog): void {
    let avatar = getAvatar(event.params.tokenId);
    avatar.balance = ZERO_BI;
    avatar.save();

    let avatarBalance = getAvatarBalance(event.params.user, event.params.tokenId);
    avatarBalance.amount = ZERO_BI;
    avatarBalance.save();

    let avatarDecomposeHistory = AvatarDecomposeHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (avatarDecomposeHistory == null) {
        avatarDecomposeHistory = new AvatarDecomposeHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        avatarDecomposeHistory.hash = event.transaction.hash;
        avatarDecomposeHistory.avatar = avatar.id;
        avatarDecomposeHistory.user = event.params.user;
        avatarDecomposeHistory.save();
    }
}

export function handleTransfer(event: Transfer): void {
    let avatar = getAvatar(event.params.tokenId);

    // let fromBalance = AvatarBalance.load(event.params.from.toHexString().concat("-").concat(event.params.tokenId.toString()));
    let fromBalance = getAvatarBalance(event.params.from, event.params.tokenId);
    let toBalance = getAvatarBalance(event.params.to, event.params.tokenId);

    if (event.params.from.equals(ADDRESS_ZERO)) {
        return;
    }

    if (event.params.to.equals(ADDRESS_ZERO)) {
        return;
    }

    fromBalance.amount = ZERO_BI;
    toBalance.amount = ONE_BI;

    fromBalance.save();
    toBalance.save();

    let avatarTransferHistory = AvatarTransferHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (avatarTransferHistory == null) {
        avatarTransferHistory = new AvatarTransferHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        avatarTransferHistory.from = event.params.from;
        avatarTransferHistory.to = event.params.to;
        avatarTransferHistory.hash = event.transaction.hash;
        avatarTransferHistory.tokenID = event.params.tokenId;
        avatarTransferHistory.save();
    }
}

export function handleComponentMint(event: ComponentMint): void {
    let component = getComponent(event.params.tokenId);
    component.balance = component.balance.plus(event.params.amount);
    component.save();

    let componentBalance = getComponentBalance(event.params.creator, event.params.tokenId);
    componentBalance.amount = componentBalance.amount.plus(event.params.amount);
    componentBalance.save();

    let componentMintHistory = ComponentMintHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (componentMintHistory == null) {
        componentMintHistory = new ComponentMintHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        componentMintHistory.component = component.id;
        componentMintHistory.hash = event.transaction.hash;
        componentMintHistory.amount = event.params.amount;
        componentMintHistory.user = event.params.creator;
        componentMintHistory.save();
    }
}

export function handleComponentBurn(event: ComponentBurn): void {
    let component = getComponent(event.params.tokenId);
    component.balance = component.balance.minus(event.params.amount);
    component.save();

    let componentBalance = getComponentBalance(event.params.account, event.params.tokenId);
    componentBalance.amount = componentBalance.amount.minus(event.params.amount);
    componentBalance.save();

    let componentBurnHistory = ComponentBurnHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (componentBurnHistory == null) {
        componentBurnHistory = new ComponentBurnHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        componentBurnHistory.component = component.id;
        componentBurnHistory.hash = event.transaction.hash;
        componentBurnHistory.amount = event.params.amount;
        componentBurnHistory.user = event.params.account;
        componentBurnHistory.save();
    }

}

export function handleTransferSingle(event: TransferSingle): void {
    let component = getComponent(event.params.id);

    let fromBalance = getComponentBalance(event.params.from, event.params.id);
    let toBalance = getComponentBalance(event.params.to, event.params.id);

    if (event.params.from.equals(ADDRESS_ZERO)) {
        return;
    }

    if (event.params.to.equals(ADDRESS_ZERO)) {
        return;
    }

    fromBalance.amount = fromBalance.amount.minus(event.params.value);
    toBalance.amount = toBalance.amount.plus(event.params.value);
    fromBalance.save();
    toBalance.save();

    let componentTransferHistory = ComponentTransferHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
    if (componentTransferHistory == null) {
        componentTransferHistory = new ComponentTransferHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        componentTransferHistory.from = event.params.from;
        componentTransferHistory.to = event.params.to;
        componentTransferHistory.amount = event.params.value;
        componentTransferHistory.hash = event.transaction.hash;
        componentTransferHistory.tokenID = event.params.id;
        componentTransferHistory.save();
    }
}

export function handleTransferBatch(event: TransferBatch): void {
    let ids = event.params.ids;
    let values = event.params.values;

    for (let i = 0; i < ids.length; i++) {
        let component = getComponent(ids[i]);

        let fromBalance = getComponentBalance(event.params.from, ids[i]);
        let toBalance = getComponentBalance(event.params.to, ids[i]);

        if (event.params.from.equals(ADDRESS_ZERO)) {
            continue;
        }
        if (event.params.to.equals(ADDRESS_ZERO)) {
            continue;
        }

        fromBalance.amount = fromBalance.amount.minus(values[i]);
        toBalance.amount = toBalance.amount.plus(values[i]);
        fromBalance.save();
        toBalance.save();

        let componentTransferHistory = ComponentTransferHistory.load(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
        if (componentTransferHistory == null) {
            componentTransferHistory = new ComponentTransferHistory(event.transaction.hash.toHexString().concat("-").concat(event.logIndex.toString()));
            componentTransferHistory.from = event.params.from;
            componentTransferHistory.to = event.params.to;
            componentTransferHistory.amount = values[i];
            componentTransferHistory.hash = event.transaction.hash;
            componentTransferHistory.tokenID = ids[i];
            componentTransferHistory.save();
        }

    }

}