import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import jsdocApi from 'jsdoc-api';
import jsdocParse from 'jsdoc-parse';

if (process.argv.length < 5) {
    console.log('no enough arguments: docs folder, input files');
    process.exit(0);
}

const title = process.argv[2];
const scope = title.toLowerCase();
const outputDir = process.argv[3];
const options = {
    files: process.argv.slice(4)
};

const data = jsdocApi.explainSync(options);
const templateData = jsdocParse(data, options);

const indexClasses = new Map();
const indexFilenameToClass = new Map();
const indexCallbacks = new Map();
const homeLinks = new Map();
const indexLinks = new Map([
    ['pc.Application', 'https://developer.playcanvas.com/en/api/pc.Application.html'],
    ['pc.EventHandler', 'https://developer.playcanvas.com/en/api/pc.EventHandler.html'],
    ['pc.Entity', 'https://developer.playcanvas.com/en/api/pc.Entity.html'],
    ['pc.Vec2', 'https://developer.playcanvas.com/en/api/pc.Vec2.html'],
    ['pc.Vec3', 'https://developer.playcanvas.com/en/api/pc.Vec3.html'],
    ['pc.Vec4', 'https://developer.playcanvas.com/en/api/pc.Vec4.html'],
    ['pc.Quat', 'https://developer.playcanvas.com/en/api/pc.Quat.html'],
    ['pc.Color', 'https://developer.playcanvas.com/en/api/pc.Color.html'],
    ['Set', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set']
]);

const replaceTypeLinks = function(items, classItem) {
    for (let i = 0; i < items.length; i++) {
        const className = items[i];

        if (className.startsWith('Set.<')) {
            const memberName = className.slice(5, -1);
            classItem.links.set('Set', indexLinks.get('Set'));
            if (indexLinks.has(memberName)) {
                classItem.links.set(memberName, indexLinks.get(memberName));
                items[i] = `[Set]<[${memberName}]>`;
            } else {
                items[i] = `[Set]<\`${memberName}\`>`;
            }
        } else if (indexLinks.has(className)) {
            classItem.links.set(className, indexLinks.get(className));
            items[i] = `[${className}]`;
        } else if (indexCallbacks.has(className)) {
            classItem.callbacks.add(indexCallbacks.get(className));
            items[i] = `<a href='#callback_${className}'>${className}</a>`;
        } else {
            items[i] = `\`${className}\``;
        }
    }
};

const replaceLinks = function(text, classItem, home) {
    return text.replace(/\r/g, ' ').replace(/\{@link ([a-zA-Z0-9._]+)\}/g, (part, className) => {
        if (indexLinks.has(className)) {
            classItem.links.set(className, indexLinks.get(className));
            if (home) homeLinks.set(className, indexLinks.get(className));
            return `[${className}]`;
        } else {
            return `\`${className}\``;
        }
    });
};

// index items
for (let i = 0; i < templateData.length; i++) {
    const item = templateData[i];

    // class
    if (item.kind === 'class' && !indexClasses.has(item.name)) {
        item.links = new Map();
        item.functions = new Set();
        item.events = new Set();
        item.callbacks = new Set();
        item.constructor = null;
        item.scope = scope;
        indexClasses.set(item.name, item);
        indexLinks.set(item.name, `./${item.name}.md`);
        indexFilenameToClass.set(item.meta.filename, item);
        if (!item.properties) item.properties = [];
        item.description = item.description || '';
        item.extends = item.augments ? item.augments[0] : null;

        // replace extends links
        if (item.extends) {
            if (indexLinks.has(item.extends)) {
                item.links.set(item.extends, indexLinks.get(item.extends));
                item.extends = `[${item.extends}]`;
            } else {
                item.extends = `\`${item.extends}\``;
            }
        }
    }

    // callback
    if (item.kind === 'typedef' && item.type.names[0] === 'function') {
        indexCallbacks.set(item.name, item);
        item.description = item.description || '';
    }
}

// add functions and events to classes
for (let i = 0; i < templateData.length; i++) {
    const item = templateData[i];

    if (item.kind === 'constructor') {
        item.class = indexClasses.get(item.memberof);
        if (!item.class) continue;
        item.class.constructor = item;

        item.description = replaceLinks(item.description || '', item.class);
        if (!item.params) item.params = [];
    }

    if (item.kind === 'function') {
        item.class = indexFilenameToClass.get(item.meta.filename);
        if (!item.class) continue;
        item.class.functions.add(item);

        item.description = replaceLinks(item.description || '', item.class);
        if (!item.params) item.params = [];

        // add return type links
        if (item.returns) {
            for (let p = 0; p < item.returns.length; p++) {
                replaceTypeLinks(item.returns[p].type.names, item.class);
            }
        }
    }

    if (item.kind === 'event') {
        item.class = indexFilenameToClass.get(item.meta.filename);
        if (!item.class) continue;
        item.class.events.add(item);

        item.description = replaceLinks(item.description || '', item.class);
        if (!item.params) item.params = [];
    }

    // process params
    if ((item.kind === 'function' || item.kind === 'event' || item.kind === 'constructor') && item.params && item.class) {
        for (let p = 0; p < item.params.length; p++) {
            // add links to param description
            item.params[p].description = replaceLinks(item.params[p].description || '', item.class);
            replaceTypeLinks(item.params[p].type.names, item.class);
        }
    }
}

for (const [_, classItem] of indexClasses) {
    if (classItem.description)
        classItem.description = replaceLinks(classItem.description.replace(/\r/g, ' '), classItem, true);

    for (let i = 0; i < classItem.properties.length; i++) {
        classItem.properties[i].description = replaceLinks(classItem.properties[i].description || '', classItem);

        replaceTypeLinks(classItem.properties[i].type.names, classItem);
    }

    for (const callbackItem of classItem.callbacks) {
        for (let p = 0; p < callbackItem.params.length; p++) {
            callbackItem.params[p].description = replaceLinks(callbackItem.params[p].description || '', classItem);
            replaceTypeLinks(callbackItem.params[p].type.names, classItem);
        }
    }
}

// get an index template
const indexTemplateString = fs.readFileSync('./docs/templates/index.ejs').toString();
const indexTemplate = ejs.compile(indexTemplateString, {
    filename: './docs/templates/index.ejs'
});

// render index
fs.writeFileSync(path.resolve(outputDir, 'README.md'), indexTemplate({
    title: title,
    classes: indexClasses,
    links: homeLinks
}));

// get a class template
const classTemplateString = fs.readFileSync('./docs/templates/class.ejs').toString();
const classTemplate = ejs.compile(classTemplateString, {
    filename: './docs/templates/class.ejs'
});

// render each class
for (const [className, classItem] of indexClasses) {
    fs.writeFileSync(path.resolve(outputDir, `${className}.md`), classTemplate(classItem));
}

//
// main index file
//

const globalLinks = new Map();

const processIndexFile = function(path, scope) {
    let data = fs.readFileSync(path).toString();
    // replace all links
    data = data.replaceAll(/((: )|(='))\.\/([a-zA-Z.0-9]+?.md)/g, `$1./${scope}/$4`);

    const links = [];

    const items = data.matchAll(/^(\[[a-zA-Z0-9.]+\]):\s+(.+)$/gm);
    for (const item of items) {
        if (item[2].startsWith('./')) {
            links.push(item);
        } else {
            globalLinks.set(item[1], item[2].trim());
        }
        data = data.replace(item[0] + '\r\n', '');
    }

    for (let i = 0; i < links.length; i++) {
        const item = links[i];
        data = data.replaceAll(item[1], `${item[1]}(${item[2].trim()})`);
    }

    return data;
};

const readmeServer = processIndexFile('./docs/server/README.md', 'server');
const readmeClient = processIndexFile('./docs/client/README.md', 'client');
const readmeNode = processIndexFile('./docs/node/README.md', 'node');

// global links
let links = '';
for (const [linkName, linkHref] of globalLinks) {
    links += linkName + ': ' + linkHref + '  \r\n';
}

// write index file
fs.writeFileSync('./docs/README.md', `# API Documentation\n\n${readmeServer}\n\n${readmeNode}\n\n${readmeClient}\n${links}`);
