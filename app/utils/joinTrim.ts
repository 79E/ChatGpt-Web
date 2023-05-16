export function joinTrim(arr: Array<string | number | undefined>): string {
    arr = arr.filter(x => x !== 'undefined');
    return arr.join(' ').trim();
}
