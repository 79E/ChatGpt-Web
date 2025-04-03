export default function getRandomChars(str: string, length = 8) {
    const chars = str.split('');
    const indexes: Set<number> = new Set();
    while (indexes.size < length) {
      indexes.add(Math.floor(Math.random() * chars.length));
    }
    return Array.from(indexes).sort().map((index: number) => chars[index]).join('');
}