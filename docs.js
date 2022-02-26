import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import jsdocApi from 'jsdoc-api';
import jsdocParse from 'jsdoc-parse';

const outputDir = './docs/server/';

const options = {
    files: [
        './src/server/index.js',
        './src/server/core/**/*.js'
    ]
};

const data = jsdocApi.explainSync(options);
const templateData = jsdocParse(data, options);

const indexClasses = new Map();
const indexFilenameToClass = new Map();
const homeLinks = new Map();
const indexLinks = new Map([
    ['pc.Application', 'https://developer.playcanvas.com/en/api/pc.Application.html']
]);

const replaceTypeLinks = function(items, classItem) {
    for (let i = 0; i < items.length; i++) {
        const className = items[i];

        if (className.startsWith('Set.<')) {
            const memberName = className.slice(5, -1);
            if (indexLinks.has(memberName)) {
                classItem.links.set(memberName, indexLinks.get(memberName));
                items[i] = `Set([${memberName}]);`;
            } else {
                items[i] = `Set(\`${memberName}\`)`;
            }
        } else if (indexLinks.has(className)) {
            classItem.links.set(className, indexLinks.get(className));
            items[i] = `[${className}]`;
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

// index classes
for (let i = 0; i < templateData.length; i++) {
    const item = templateData[i];

    if (item.kind === 'class') {
        item.links = new Map();
        item.functions = new Set();
        item.events = new Set();
        indexClasses.set(item.name, item);
        indexLinks.set(item.name, `./${item.name}.md`);
        indexFilenameToClass.set(item.meta.filename, item);
        if (!item.properties) item.properties = [];
    }
}

// add functions and events to classes
for (let i = 0; i < templateData.length; i++) {
    const item = templateData[i];

    if (item.kind === 'function') {
        const classItem = indexFilenameToClass.get(item.meta.filename);
        if (!classItem) continue;
        classItem.functions.add(item);

        item.description = replaceLinks(item.description || '', classItem);
        if (!item.params) item.params = [];

        // add return type links
        if (item.returns) {
            for (let p = 0; p < item.returns.length; p++) {
                replaceTypeLinks(item.returns[p].type.names, classItem);
            }
        }
    }

    if (item.kind === 'event') {
        const classItem = indexFilenameToClass.get(item.meta.filename);
        if (!classItem) continue;
        classItem.events.add(item);

        item.description = replaceLinks(item.description || '', classItem);
        if (!item.params) item.params = [];
    }

    // process params
    if ((item.kind === 'function' || item.kind === 'event') && item.params) {
        const classItem = indexFilenameToClass.get(item.meta.filename);
        if (!classItem) continue;

        for (let p = 0; p < item.params.length; p++) {
            // add links to param description
            item.params[p].description = replaceLinks(item.params[p].description || '', classItem);

            replaceTypeLinks(item.params[p].type.names, classItem);
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
}

// get an index template
const indexTemplateString = fs.readFileSync('./docs/templates/index.ejs').toString();
const indexTemplate = ejs.compile(indexTemplateString, {
    filename: './docs/templates/index.ejs'
});

// render index
fs.writeFileSync(path.resolve(outputDir, 'README.md'), indexTemplate({
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
