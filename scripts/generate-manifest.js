import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, '../public/Resources');
const outputFile = path.join(__dirname, '../public/resources.json');

const generateManifest = () => {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
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
        // Add to main subjects list (lightweight)
        subjects.push({
          name: item,
          files: files // We actually only need the count for the home page, but keeping struct similar
        });

        // Write individual subject file (heavyweight)
        const subjectData = {
          generatedAt: new Date().toISOString(),
          name: item,
          files: files
        };
        const subjectPath = path.join(dataDir, `${item}.json`);
        fs.writeFileSync(subjectPath, JSON.stringify(subjectData, null, 2));
        console.log(`Generated data for: ${item}`);
      }
    }
  }

  // Write main subjects index (lightweight)
  // We map to create a lighter version for the home page that only needs names and counts
  const subjectsIndex = {
    generatedAt: new Date().toISOString(),
    subjects: subjects.map(s => ({
      name: s.name,
      files: s.files // Keeping full files for now to match interface, but in future could just be count
    }))
  };

  const subjectsFile = path.join(__dirname, '../public/subjects.json');
  fs.writeFileSync(subjectsFile, JSON.stringify(subjectsIndex, null, 2));

  console.log(`Subjects index generated at: ${subjectsFile}`);
  console.log(`Found ${subjects.length} subjects.`);
};

generateManifest();
