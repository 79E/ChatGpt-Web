import { ChatsInfo } from '@/types';
import { generateUUID } from './generateUUID';

export function generateChatInfo (): ChatsInfo  {
    const uuid = generateUUID();
    return {
        path: uuid,
        id: uuid,
        name: '新的对话',
        data: []
    }
}
