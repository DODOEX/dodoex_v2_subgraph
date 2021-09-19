import {NewERC20} from "../../types/token/ERC20Factory/ERC20Factory"
import {
    createUser,
    fetchTokenName,
    fetchTokenDecimals,
    fetchTokenSymbol,
    fetchTokenTotalSupply,
    ZERO_BI,
    getDODOToken,
    fetchTokenNameByCall, fetchTokenSymbolByCall, fetchTokenDecimalsByCall, fetchTokenTotalSupplyByCall, ONE_BI
} from "./helpers"
import {Token} from "../../types/token/schema"
import {MintableERC20 as MintableERC20Template} from "../../types/token/templates"

export function handleNewERC20(event: NewERC20): void {
    let user = createUser(event.params.creator, event);
    let token = Token.load(event.params.erc20.toHexString());

    let dodoToken = getDODOToken();
    if (token == null) {
        token = new Token(event.params.erc20.toHexString())
        token.creator = user.id;
        token.name = fetchTokenName(event.params.erc20);
        token.symbol = fetchTokenSymbol(event.params.erc20);
        token.decimals = fetchTokenDecimals(event.params.erc20);
        token.totalSupply = fetchTokenTotalSupply(event.params.erc20);
        token.timestamp = event.block.timestamp;
        token.type = ZERO_BI;
        token.holderCount = ZERO_BI;
        token.updatedAt = event.block.timestamp;
        dodoToken.tokens = dodoToken.tokens.plus(ONE_BI);
        dodoToken.updatedAt = event.block.timestamp;
    }

    token.save();
    dodoToken.save();
    MintableERC20Template.create(event.params.erc20);
}