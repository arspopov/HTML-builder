const fs = require('fs/promises');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsSrc = path.join(__dirname, 'assets');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const items = await fs.readdir(src, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);
    if (item.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildHtml() {
  let templateContent = await fs.readFile(templatePath, 'utf-8');

  const regex = /{{\s*(\w+)\s*}}/g;
  let match;

  while ((match = regex.exec(templateContent)) !== null) {
    const tagName = match[1];
    const fullMatch = match[0];
    const componentPath = path.join(componentsDir, `${tagName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(fullMatch, componentContent);
    } catch {
      console.warn(`Component ${tagName} not found`);
    }
  }

  const distHTML = path.join(distPath, 'index.html');
  await fs.writeFile(distHTML, templateContent);
}

async function buildStyles() {
  const bundlePath = path.join(distPath, 'style.css');
  let mergedCSS = '';

  const items = await fs.readdir(stylesDir, { withFileTypes: true });
  for (const item of items) {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const filePath = path.join(stylesDir, item.name);
      const content = await fs.readFile(filePath, 'utf-8');
      mergedCSS += content + '\n';
    }
  }

  await fs.writeFile(bundlePath, mergedCSS);
}

async function main() {
  try {
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath, { recursive: true });

    await buildHtml();

    await buildStyles();

    const assetsDest = path.join(distPath, 'assets');
    await copyDir(assetsSrc, assetsDest);

    console.log('Project was successfull builded in folder project-dist!');
  } catch (err) {
    console.error('Error when project was building:', err);
  }
}

main();
