import {DODONFT} from "../../types/nft/DODONFT1155/DODONFT"
import {DODONFT1155} from "../../types/nft/DODONFT1155/DODONFT1155"
import {Nft, Fragment, User} from "../../types/nft/schema";
import {Address, BigDecimal, BigInt, ethereum} from "@graphprotocol/graph-ts";
import {Fragment as FragmentContract} from "../../types/nft/templates/Fragment/Fragment"
import {exponentToBigDecimal} from "../dodoex/helpers";

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)
export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

function fetchNFTName(address: Address): String {
    let name = null;
    let erc721Contract = DODONFT.bind(address);
    let erc721name = erc721Contract.try_name();
    if (erc721name.reverted != true) {
        name = erc721name.value;
    }
    return name;
}

export function createAndGetNFT(address: Address, tokenId: BigInt, event: ethereum.Event): Nft {
    let key = address.toHexString().concat("-").concat(tokenId.toString())
    let nft = Nft.load(key);
    if (nft == null || nft.uri === "") {
        nft = new Nft(key);
        nft.address = address;
        nft.createdAt = event.block.timestamp;
        nft.updatedAt = event.block.timestamp;

        let nft721 = DODONFT.bind(address);
        let uri721 = nft721.try_tokenURI(tokenId);
        if (!uri721.reverted) {
            nft.type = "721"
            nft.uri = uri721.value;
        }

        let nft1155 = DODONFT1155.bind(address);
        let uri1155 = nft1155.try_uri(tokenId);
        if (!uri1155.reverted) {
            nft.type = "1155"
            nft.uri = uri1155.value;
        }

        nft.save()
    }
    return nft as Nft;
}

export function updateNft(address: Address, tokenId: BigInt, event: ethereum.Event): void {
    let nft = createAndGetNFT(address, tokenId, event);

    let nft721 = DODONFT.bind(address);
    let uri721 = nft721.try_tokenURI(tokenId);
    if (!uri721.reverted) {
        nft.type = "721"
        nft.uri = uri721.value;
    }

    let nft1155 = DODONFT.bind(address);
    let uri1155 = nft1155.try_tokenURI(tokenId);
    if (!uri1155.reverted) {
        nft.type = "1155"
        nft.uri = uri1155.value;
    }

    nft.updatedAt = event.block.timestamp;
    nft.save();

}

export function createAndGetFragment(address: Address, event: ethereum.Event): Fragment {
    let fragmentContract = FragmentContract.bind(address);
    let fragment = Fragment.load(address.toHexString());
    if (fragment == null) {
        fragment = new Fragment(address.toHexString());
        fragment.isBuyOut = fragmentContract._IS_BUYOUT_();
        fragment.buyoutTimestamp = fragmentContract._BUYOUT_TIMESTAMP_();
        fragment.decimals = fragmentContract.decimals();
        fragment.dvm = fragmentContract._DVM_().toHexString();
        fragment.initialized = fragmentContract.initialized();
        fragment.name = fragmentContract.name();
        fragment.symbol = fragmentContract.symbol();
        fragment.quote = fragmentContract._QUOTE_().toHexString();
        fragment.totalSupply = fragmentContract.totalSupply();
        fragment.vaultPreOwner = fragmentContract._VAULT_PRE_OWNER_().toHexString();
        fragment.createdAt = event.block.timestamp;
        fragment.updatedAt = event.block.timestamp;
    }
    return fragment as Fragment;
}

export function createUser(address: Address, event: ethereum.Event): User {
    let user = User.load(address.toHexString());
    if (user == null) {
        user = new User(address.toHexString());
        user.createdAt = event.block.timestamp;
        user.updatedAt = event.block.timestamp;
        user.save();
    }
    return user as User;
}