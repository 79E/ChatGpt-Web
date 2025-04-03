import { carmiModel } from '../../models';
import { formatTime } from '../../utils';

async function scheduleCarmi(){
    const time = formatTime('yyyy-MM-dd')
    carmiModel.checkCarmiEndTime(time);
}

export default scheduleCarmi;