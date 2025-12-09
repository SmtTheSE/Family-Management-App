// Script to check if environment variables are properly embedded in the build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the built JavaScript file
const buildDir = path.join(__dirname, 'dist', 'assets');
console.log('Checking build directory:', buildDir);

if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist. Please run "npm run build" first.');
  process.exit(1);
}

// Find the main JS file
const files = fs.readdirSync(buildDir);
const jsFiles = files.filter(file => file.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('No JavaScript files found in build directory');
  process.exit(1);
}

console.log('Found JS files:', jsFiles);

// Check the first (and probably only) JS file for Supabase URL
const jsFilePath = path.join(buildDir, jsFiles[0]);
const jsContent = fs.readFileSync(jsFilePath, 'utf-8');

console.log('\n--- Checking for Supabase URL in build ---');
if (jsContent.includes('oixtcofqjffaadkzrfrr.supabase.co')) {
  console.log('✅ Supabase URL found in build');
} else {
  console.log('❌ Supabase URL NOT found in build');
}

console.log('\n--- Checking for API key fragment in build ---');
// Check for part of the anon key
if (jsContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
  console.log('✅ Supabase Anon Key found in build');
} else {
  console.log('❌ Supabase Anon Key NOT found in build');
}

console.log('\n--- Build Analysis Complete ---');