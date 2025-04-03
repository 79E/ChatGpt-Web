import crypto from 'crypto'
import getRandomChars from './getRandomChars';
function crc32(str: string) {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    const crc = getRandomChars(hash);
    return crc
}

export default {
    crc32
}