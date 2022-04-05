import sysPath from 'path';
import { BACK_SLASH_RE, DOUBLE_SLASH_RE, SLASH, SLASH_SLASH } from 'chokidar/lib/constants.js';

const DEFAULT_ROUND_PRECISION = 3;

export function roundTo(number, digits = DEFAULT_ROUND_PRECISION) {
    const pow = Math.pow(10, digits);
    return Math.round(number * pow) / pow;
}

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const unifyPath = (path) => toUnix(sysPath.normalize(toUnix(path)));

// chokidar path unification
const toUnix = (string) => {
    let str = string.replace(BACK_SLASH_RE, SLASH);
    let prepend = false;
    if (str.startsWith(SLASH_SLASH)) {
        prepend = true;
    }
    while (str.match(DOUBLE_SLASH_RE)) {
        str = str.replace(DOUBLE_SLASH_RE, SLASH);
    }
    if (prepend) {
        str = SLASH + str;
    }
    return str;
};
