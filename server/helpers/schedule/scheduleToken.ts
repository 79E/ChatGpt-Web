import { aikeyModel } from '../../models';
import { checkAiKeyQueue } from '../queue';

async function scheduleToken(){
    const tokens = await aikeyModel.getAikeys({page: 0, page_size: 100}, {
        status: 1,
		check: 1
    })
    const list = tokens.rows
    list.forEach((item)=>{
        checkAiKeyQueue.addTask({
            ...item.toJSON()
        })
    })
}

export default scheduleToken;
