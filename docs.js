import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function generateMarkdown(dir) {
    fs.readdirSync(dir).forEach(name => {
        const filePath = path.join(dir, name);

        if (name.indexOf('.js') === -1) {
            generateMarkdown(filePath);
            return;
        }

        const outputDir = dir.replace('src\\client', 'docs');
        const outputName = name.replace('.js', '.md');
        fs.mkdirSync(outputDir, { recursive: true });
        execSync(`node ./node_modules/jsdoc-to-markdown/bin/cli.js --partial ./tmpl/*.hbs --files ${filePath} > ${outputDir}\\${outputName}`);
    });
}

generateMarkdown('src\\client');
