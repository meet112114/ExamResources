import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, '../public/Resources');
const outputFile = path.join(__dirname, '../public/manifest.json');

const generateManifest = () => {
  if (!fs.existsSync(resourcesDir)) {
    console.error(`Resources directory not found at: ${resourcesDir}`);
    process.exit(1);
  }

  const subjects = [];

  const items = fs.readdirSync(resourcesDir);

  for (const item of items) {
    const itemPath = path.join(resourcesDir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath).filter(f => f.toLowerCase().endsWith('.pdf'));
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
