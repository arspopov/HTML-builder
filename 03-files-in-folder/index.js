// 03-files-in-folder/index.js

const fs = require('fs/promises');
const path = require('path');

async function showFilesInfo() {
  try {
    const secretFolderPath = path.join(__dirname, 'secret-folder');

    const dirents = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const dirent of dirents) {
      if (dirent.isFile()) {
        const fileName = dirent.name;

        const filePath = path.join(secretFolderPath, fileName);

        const stats = await fs.stat(filePath);

        const fileSize = stats.size;

        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);

        const extWithoutDot = ext.slice(1);

        console.log(`${baseName} - ${extWithoutDot} - ${fileSize} bytes`);
      }
    }
  } catch (err) {
    console.error('Error when reading folder or file:', err);
  }
}

showFilesInfo();
