import {NewERC20} from "../../types/token/ERC20V2Factory/ERC20V2Factory"
import {
    createUser,
    fetchTokenBalance,
    fetchTokenName,
    fetchTokenDecimals,
    fetchTokenSymbol,
    fetchTokenTotalSupply,
    ZERO_BI, fetchTokenNameByCall, fetchTokenSymbolByCall, fetchTokenDecimalsByCall, fetchTokenTotalSupplyByCall
} from "./helpers"
import {Token} from "../../types/token/schema"
import {MintableERC20 as MintableERC20Template} from "../../types/token/templates"

export function handleNewERC20(event: NewERC20): void {
    let user = createUser(event.params.creator, event);
    let token = Token.load(event.params.erc20.toHexString());
    if (token == null) {
        token = new Token(event.params.erc20.toHexString())
        token.creator = user.id;
        token.name = fetchTokenNameByCall(event.params.erc20);
        token.symbol = fetchTokenSymbolByCall(event.params.erc20);
        token.decimals = fetchTokenDecimalsByCall(event.params.erc20);
        token.totalSupply = fetchTokenTotalSupplyByCall(event.params.erc20);
        token.timestamp = event.block.timestamp;
        token.type = event.params.erc20Type;
        token.holderCount = ZERO_BI;
    }

    token.save();

    MintableERC20Template.create(event.params.erc20);
}