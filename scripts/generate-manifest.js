import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, '../public/Resources');
const outputFile = path.join(__dirname, '../public/resources.json');

const generateManifest = () => {
  if (!fs.existsSync(resourcesDir)) {
    console.error(`Resources directory not found at: ${resourcesDir}`);
    process.exit(1);
  }

  const subjects = [];

  const items = fs.readdirSync(resourcesDir);

  // Helper function to recursively find PDF files
  const getPdfFiles = (dir, rootDir) => {
    let results = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        results = results.concat(getPdfFiles(filePath, rootDir));
      } else if (file.toLowerCase().endsWith('.pdf')) {
        // Get path relative to the subject root directory
        // Replace backslashes with forward slashes for URL compatibility
        const relativePath = path.relative(rootDir, filePath).split(path.sep).join('/');
        results.push(relativePath);
      }
    }
    return results;
  };

  for (const item of items) {
    const itemPath = path.join(resourcesDir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const files = getPdfFiles(itemPath, itemPath);
      if (files.length > 0) {
        subjects.push({
          name: item,
          files: files
        });
      }
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    subjects: subjects
  };

  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
  console.log(`Manifest generated at: ${outputFile}`);
  console.log(`Found ${subjects.length} subjects.`);
};

generateManifest();
