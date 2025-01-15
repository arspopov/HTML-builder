const fs = require('fs/promises');
const path = require('path');

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

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

async function main() {
  try {
    await fs.rm(destFolder, { recursive: true, force: true });
    await copyDir(srcFolder, destFolder);
    console.log('Folder files successfully copied in files-copy!');
  } catch (err) {
    console.error('Error when copying:', err);
  }
}

main();
