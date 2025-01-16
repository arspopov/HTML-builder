const fs = require('fs/promises');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(distDir, 'bundle.css');

async function mergeStyles() {
  try {
    const items = await fs.readdir(stylesDir, { withFileTypes: true });

    const cssFiles = items.filter((item) => {
      return item.isFile() && path.extname(item.name) === '.css';
    });

    let mergedCSS = '';

    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file.name);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      mergedCSS += fileContent + '\n';
    }
    await fs.writeFile(bundlePath, mergedCSS);

    console.log('Styles merged successfully into bundle.css!');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

mergeStyles();
