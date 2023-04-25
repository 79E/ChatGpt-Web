import { ChatResultInfo } from '@/types';

export function handleChatData(text: string): Array<ChatResultInfo>{
    const data = text.split('\n').filter(item => item !== undefined && item !== null && item.trim() !== '').map(d => JSON.parse(d));
    return data;
}
