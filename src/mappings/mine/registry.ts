import {MinePool, RewardDetail} from "../../types/dodomine/schema"
import {NewMineV3} from "../../types/dodomine/DODOMineV3Registry/DODOMineV3Registry"

export function handleNewMineV3(event: NewMineV3): void {
    let minePool = MinePool.load(event.params.mine.toHexString());

    if (minePool == null) {
        minePool = new MinePool(event.params.mine.toHexString());
    }
    minePool.pool = event.params.mine;
    minePool.isLpToken = event.params.isLpToken;
    minePool.save();
}
