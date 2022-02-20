const DEFAULT_ROUND_PRECISION = 3;

export function roundTo(number, digits = DEFAULT_ROUND_PRECISION) {
    const pow = Math.pow(10, digits);
    return Math.round(number * pow) / pow;
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
