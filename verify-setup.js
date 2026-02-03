#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to check if your environment is properly configured
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Low Rating Places Finder setup...\n');

let hasErrors = false;

// Check 1: Node.js version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (>=18.0.0 required)\n`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (18.0.0+ required)\n`);
  hasErrors = true;
}

// Check 2: package.json exists
console.log('2️⃣  Checking package.json...');
if (fs.existsSync('package.json')) {
  console.log('   ✅ package.json found\n');
} else {
  console.log('   ❌ package.json not found\n');
  hasErrors = true;
}

// Check 3: node_modules installed
console.log('3️⃣  Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules directory exists\n');
} else {
  console.log('   ⚠️  node_modules not found. Run: npm install\n');
  hasErrors = true;
}

// Check 4: .env file
console.log('4️⃣  Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env file exists');
  
  // Check if API key is set
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('GOOGLE_PLACES_API_KEY=') && 
      !envContent.includes('your_api_key_here') &&
      !envContent.includes('your_actual_api_key_here')) {
    console.log('   ✅ GOOGLE_PLACES_API_KEY appears to be set\n');
  } else {
    console.log('   ⚠️  GOOGLE_PLACES_API_KEY needs to be configured');
    console.log('   👉 Edit .env and add your Google Places API key\n');
    hasErrors = true;
  }
} else {
  console.log('   ⚠️  .env file not found');
  console.log('   👉 Run: cp .env.example .env');
  console.log('   👉 Then edit .env and add your API key\n');
  hasErrors = true;
}

// Check 5: Required directories
console.log('5️⃣  Checking project structure...');
const requiredDirs = ['app', 'app/api', 'app/api/search', 'lib', 'types'];
let dirsOk = true;
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.log(`   ❌ Missing directory: ${dir}`);
    dirsOk = false;
    hasErrors = true;
  }
}
if (dirsOk) {
  console.log('   ✅ All required directories present\n');
}

// Check 6: Required files
console.log('6️⃣  Checking required files...');
const requiredFiles = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/api/search/route.ts',
  'lib/googlePlaces.ts',
  'lib/csv.ts',
  'types/places.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'next.config.js'
];
let filesOk = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.log(`   ❌ Missing file: ${file}`);
    filesOk = false;
    hasErrors = true;
  }
}
if (filesOk) {
  console.log('   ✅ All required files present\n');
}

// Summary
console.log('═'.repeat(50));
if (!hasErrors) {
  console.log('✨ Setup verification complete! Everything looks good.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Start searching for low-rated places!\n');
} else {
  console.log('⚠️  Setup verification found some issues.');
  console.log('\n📝 Action items:');
  if (!fs.existsSync('node_modules')) {
    console.log('   • Run: npm install');
  }
  if (!fs.existsSync('.env')) {
    console.log('   • Run: cp .env.example .env');
    console.log('   • Edit .env and add your Google Places API key');
  }
  console.log('\n📚 For help, see: README.md or QUICKSTART.md\n');
  process.exit(1);
}
