import Queue from 'bull'
import config from '../../config';

function createQueue(queueName) {
    return new Queue(queueName, {
        redis: {
            ...config.getConfig('redis_config'),
            db: 11
        },
        defaultJobOptions: {
            removeOnComplete: false,
            removeOnFail: false,
        }
    });
}

export default createQueue;