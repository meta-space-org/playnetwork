export function roundTo(number, digits) {
    const pow = Math.pow(10, digits);
    return Math.round(number * pow) / pow;
}

export function deleteEmptyObjects(obj) {
    for (let key in obj) {
        if (typeof obj[key] !== 'object')
            continue;

        deleteEmptyObjects(obj[key]);

        if (Object.keys(obj[key]).length === 0)
            delete obj[key];
    }
}
