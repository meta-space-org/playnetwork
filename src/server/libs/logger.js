import path from 'path';

let relativePath = '';

global.console.setRelativePath = (filePath) => {
    relativePath = path.dirname(filePath);
};

function processStack(stack) {
    let lines = stack.split('\n');

    lines = lines.filter((line, ind) => {
        if (ind === 0) {
            // remove first error message
            return false;
        } else if (line.includes('node:internal')) {
            // remove internal errors
            return false;
        }
        return true;
    });

    lines = lines.map((line) => {
        line = line.slice(7); // remove "at"
        if (relativePath && line.includes(relativePath)) {
            // make paths relative to project
            line = line.replace(relativePath, '');
        } if (line.includes('node_modules\\playcanvas\\build\\playcanvas.js:')) {
            // replace playcanvas engine path
            line = line.replace(/\s\([a-zA-Z:\\_]+playcanvas\.js:/, ' (playcanvas.js:');
        }

        // :line:char > :line
        line = line.replace(/(:[0-9]+):[0-9]+/, '$1');

        // name (location) > location (name)
        line = line.replace(/([a-zA-Z0-9\\._<>]+)\s\(([a-zA-Z\\./]+:[0-9]+)\)/, '$2 ($1)');

        return line;
    });

    return lines.join('\n');
};

const consoleLog = console.log;
const consoleInfo = console.info;
const consoleWarn = console.warn;
const consoleError = console.error;

global.console.log = function(...args) {
    consoleLog.call(console, ...args);
};

global.console.info = function(...args) {
    consoleInfo.call(console, '\x1b[36m%s', ...args, '\x1b[0m');
};

global.console.warn = function(...args) {
    consoleWarn.call(console, '\x1b[33m%s', ...args, '\x1b[0m');
};

global.console.error = function(...args) {
    if (args[0] instanceof Error) {
        const err = args[0];
        consoleError.call(console, '\x1b[31m%s\x1b[0m', `ERROR: ${err.message}`);
        consoleError.call(console, processStack(err.stack));
    } else {
        consoleError.call(console, ...args);
    }
};

export default console;
