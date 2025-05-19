const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Find all TypeScript files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check if a file contains an empty array without explicit typing
function checkFileForEmptyArrays(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to match variable declarations with empty arrays
  const emptyArrayPattern = /const\s+(\w+)\s*=\s*\[\]/g;
  
  let match;
  let needsTyping = false;
  
  while ((match = emptyArrayPattern.exec(content)) !== null) {
    const variableName = match[1];
    
    // Check if it already has a type annotation
    const hasTypeAnnotation = new RegExp(`const\\s+${variableName}\\s*:\\s*[\\w\\[\\]<>,\\s]+\\s*=\\s*\\[\\]`).test(content);
    
    if (!hasTypeAnnotation) {
      console.log(`Found untyped empty array '${variableName}' in ${filePath}`);
      needsTyping = true;
    }
  }
  
  return needsTyping;
}

// Main function
function findAndReportUntypedArrays() {
  const files = findTsxFiles('src');
  let untypedArraysFound = false;
  
  files.forEach(file => {
    if (checkFileForEmptyArrays(file)) {
      untypedArraysFound = true;
    }
  });
  
  if (untypedArraysFound) {
    console.log('\nYou need to fix these files by adding type annotations to the empty arrays.');
    console.log('For example, change: const users = []');
    console.log('To: const users: User[] = []');
  } else {
    console.log('No untyped empty arrays found.');
  }
}

// Run the script
findAndReportUntypedArrays(); 