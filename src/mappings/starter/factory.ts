import {NewFairFund, NewInstantFund} from "../../types/starter/DODOStarterFactory/DODOStarterFactory"
import {FairFunding as FairFundingTemplate, InstantFunding as InstantFundingTemplate} from "../../types/starter/templates"
import {Starter} from "../../types/starter/schema"

export function handleNewFairFund(event: NewFairFund): void {
    let starter = Starter.load(event.params.fairFundPool.toHexString());
    if (starter == null) {
        starter = new Starter(event.params.fairFundPool.toHexString());
        starter.type = "Fair";
        starter.base = event.params.baseToken;
        starter.fund = event.params.fundToken;
        starter.creator = event.params.creator
        starter.timestamp = event.block.timestamp;
        starter.updatedAt = event.block.timestamp;
        starter.save();
        FairFundingTemplate.create(event.params.fairFundPool);
    }
}

export function handleNewInstantFund(event: NewInstantFund): void {
    let starter = Starter.load(event.params.instantFundPool.toHexString());
    if (starter == null) {
        starter = new Starter(event.params.instantFundPool.toHexString());
        starter.type = "Instant";
        starter.base = event.params.baseToken;
        starter.fund = event.params.fundToken;
        starter.creator = event.params.creator
        starter.timestamp = event.block.timestamp;
        starter.updatedAt = event.block.timestamp;
        starter.save();
        InstantFundingTemplate.create(event.params.instantFundPool);
    }
}
