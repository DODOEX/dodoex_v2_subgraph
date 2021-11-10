import {Avatar, AvatarBalance, Component, ComponentBalance} from "../../types/avatar/schema"
import {Address, BigInt, BigDecimal} from "@graphprotocol/graph-ts"
import {ZERO_BI} from "../utils/helper";

export function getAvatar(tokenID: BigInt): Avatar {
    let avatar = Avatar.load(tokenID.toHexString());
    if (avatar == null) {
        avatar = new Avatar(tokenID.toHexString());
        avatar.balance = ZERO_BI;
        avatar.componentsID = ZERO_BI;
        avatar.save();
    }
    return avatar as Avatar;
}

export function getAvatarBalance(user: Address, tokenID: BigInt): AvatarBalance {
    let avatarBalance = AvatarBalance.load(user.toHexString().concat("-").concat(tokenID.toString()));

    if (avatarBalance == null) {
        avatarBalance = new AvatarBalance(user.toHexString().concat("-").concat(tokenID.toString()));
        avatarBalance.amount = ZERO_BI;
        avatarBalance.avatar = getAvatar(tokenID).id;
        avatarBalance.user = user;
        avatarBalance.save();
    }

    return avatarBalance as AvatarBalance;

}

export function getComponent(tokenID: BigInt): Component {
    let component = Component.load(tokenID.toHexString());
    if (component == null) {
        component = new Component(tokenID.toHexString());
        component.balance = ZERO_BI;
        component.save();
    }
    return component as Component;
}

export function getComponentBalance(user: Address, tokenID: BigInt): ComponentBalance {
    let componentBalance = ComponentBalance.load(user.toHexString().concat("-").concat(tokenID.toString()));

    if (componentBalance == null) {
        componentBalance = new ComponentBalance(user.toHexString().concat("-").concat(tokenID.toString()));
        componentBalance.amount = ZERO_BI;
        componentBalance.component = getComponent(tokenID).id;
        componentBalance.user = user;
        componentBalance.save();
    }

    return componentBalance as ComponentBalance;
}

