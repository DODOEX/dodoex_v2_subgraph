import {FilterAdmin} from "../../../types/nft/templates/FilterAdmin/FilterAdmin"
import {FilterERC721V1} from "../../../types/nft/DODONFTPoolProxy/FilterERC721V1"
import {FilterERC1155V1} from "../../../types/nft/DODONFTPoolProxy/FilterERC1155V1"
import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts"
import {NftPool} from "../../../types/nft/schema"

/**
 * filterAdmin
 * */
export function getOwner(address: Address): Address {
    const owner = FilterAdmin.bind(address)._OWNER_();
    return owner
}

export function getFeeRate(filerAdminAddress: Address): BigInt {
    const feeRate = FilterAdmin.bind(filerAdminAddress)._FEE_RATE_();
    return feeRate
}

export function getInitSupply(filerAdminAddress: Address): BigInt {
    const initSupply = FilterAdmin.bind(filerAdminAddress)._INIT_SUPPLY_();
    return initSupply
}

export function getName(filerAdminAddress: Address): string {
    const name = FilterAdmin.bind(filerAdminAddress).name();
    return name;
}

export function getSymbol(filerAdminAddress: Address): string {
    const symbol = FilterAdmin.bind(filerAdminAddress).symbol();
    return symbol;
}

export function getMaintainer(filerAdminAddress: Address): Address {
    const maintainer = FilterAdmin.bind(filerAdminAddress)._MAINTAINER_();
    return maintainer;
}

export function getController(filerAdminAddress: Address): Address {
    return FilterAdmin.bind(filerAdminAddress)._CONTROLLER_();
}

/**
 * filter
 * */
export function getFilterAdmin(filterAddress: Address): Address {
    return FilterERC721V1.bind(filterAddress)._OWNER_();
}

export function getCollection(filterAddress: Address): Address {
    return FilterERC721V1.bind(filterAddress)._NFT_COLLECTION_();
}

export function getToggles(filterAddress: Address): boolean {
    return FilterERC721V1.bind(filterAddress)._NFT_IN_TOGGLE_();
}

export function getStartInt(filterAddress: Address): BigInt {
    return FilterERC721V1.bind(filterAddress)._GS_START_IN_();
}

export function getIdStart(filterAddress: Address): BigInt {
    return FilterERC721V1.bind(filterAddress)._NFT_ID_START_();
}

export function getIdEnd(filterAddress: Address): BigInt {
    return FilterERC721V1.bind(filterAddress)._NFT_ID_END_();
}

export function getMaxNFTAmount(filterAddress: Address): BigInt {
    return FilterERC721V1.bind(filterAddress)._MAX_NFT_AMOUNT_();
}

export function getMinNFTAmount(filterAddress: Address): BigInt {
    return FilterERC721V1.bind(filterAddress)._MIN_NFT_AMOUNT_();
}

/**
 * globe
 * */
export function createAndGetGlobe(event: ethereum.Event): NftPool {
    let id = "DODO-NFT-POOL";
    let nftPool = NftPool.load(id);
    if (nftPool == null) {
        nftPool.createdAt = event.block.timestamp;
        nftPool.updatedAt = event.block.timestamp;
        nftPool.save();
    }
    return nftPool as NftPool
}