import {DODONFT} from "../../../types/tools/DODONFT1155/DODONFT"
import {DODONFT1155} from "../../../types/tools/DODONFT1155/DODONFT1155"
import {Nft, Account} from "../../../types/tools/schema";
import {Address, BigDecimal, BigInt, ethereum} from "@graphprotocol/graph-ts";
import {exponentToBigDecimal} from "../../dodoex/helpers";

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

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
    if (nft == null) {
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

export function createAccount(address: Address, event: ethereum.Event): Account {
    let account = Account.load(address.toHexString());
    if (account == null) {
        account = new Account(address.toHexString());
        account.createdAt = event.block.timestamp;
        account.updatedAt = event.block.timestamp;
        account.save();
    }
    return account as Account;
}