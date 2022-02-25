import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';
import path from 'path';

const outputDir = './docs/server/';

const templateData = jsdoc2md.getTemplateDataSync({
    files: [
        './src/server/index.js',
        './src/server/core/**/*.js'
    ]
});

const classIndex = { };
let linksIndex = '';
let readmeFile = '## Server Docs\n\n#### Classes:\n\n';

templateData.forEach((item) => {
    if (item.kind === 'class') {
        classIndex[item.name] = item;
        linksIndex += `[${item.name}]: ./${item.name}.md\n\n`;
        readmeFile += `* [${item.name}](./${item.name}.md)  ${item.description}\n`;
        console.log(item);
    }
});

console.log('Server docs generating');

for (const className in classIndex) {
    const classData = classIndex[className];

    const data = templateData.filter((item) => {
        if (item.meta?.filename === classData.meta.filename)
            return true;

        return false;
    });

    const template = `{{>main-index~}}{{>all-docs~}}${linksIndex}`;

    console.log(`rendering ${outputDir}${className}.md`);

    const output = jsdoc2md.renderSync({
        data: data,
        template: template,
        partial: './tmpl/*.hbs'
    });
    fs.writeFileSync(path.resolve(outputDir, `${className}.md`), output);
}

fs.writeFileSync(path.resolve(outputDir, 'README.md'), readmeFile);

console.log('Server docs finished');
