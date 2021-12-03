export function optimize(obj, decimals) {
    if (typeof obj == 'number')
        obj = +obj.toFixed(decimals);

    if (typeof obj == 'object') {
        for (const [key] of Object.entries(obj)) {
            obj[key] = optimize(obj[key], decimals);
        }
    }

    return obj;
}
