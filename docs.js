import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';
import path from 'path';
import * as helpers from './docs-helper.cjs';

const outputDir = './docs/server/';

const templateData = jsdoc2md.getTemplateDataSync({
    files: [
        './src/server/index.js',
        './src/server/core/**/*.js'
    ]
});

const classIndex = { };
let linksIndex = '';
let readmeFile = '# Server Docs\n\n## Classes\n\n';

templateData.forEach((item) => {
    if (item.kind === 'class') {
        classIndex[item.name] = item;
        linksIndex += `[${item.name}]: ./${item.name}.md\n`;
        readmeFile += `* [${item.name}]  ${helpers.inlineLinks(item.description, { data: templateData })}\n`;
    }
});

readmeFile += '\n' + linksIndex;

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
        partial: './tmpl/*.hbs',
        helper: './docs-helper.cjs'
    });
    fs.writeFileSync(path.resolve(outputDir, `${className}.md`), output);
}

fs.writeFileSync(path.resolve(outputDir, 'README.md'), readmeFile);

console.log('Server docs finished');
