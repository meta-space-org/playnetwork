const DEFAULT_ROUND_PRECISION = 3;

export function roundTo(number, digits = DEFAULT_ROUND_PRECISION) {
    const pow = Math.pow(10, digits);
    return Math.round(number * pow) / pow;
}
