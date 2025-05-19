#!/bin/bash

# Find all page.tsx files that import Sidebar component
echo "Searching for page files with Sidebar imports..."
grep -l "import Sidebar from '@/components/layout/sidebar'" --include="*.tsx" src/app/**/*.tsx > pages_to_fix.txt

# Check how many files need fixing
fileCount=$(wc -l < pages_to_fix.txt)
echo "Found $fileCount files that need fixing"

echo "Listing files that need to be fixed:"
cat pages_to_fix.txt

echo "Creating backups of each file..."
while IFS= read -r file; do
  # Create backup
  cp "$file" "$file.bak"
  
  # Add React import, replace Sidebar, and fix nested PageLayout
  # Step 1: Add use client directive and React import if missing
  sed -i '' '1i\
"use client"\
\
import React from "react"\
import PageLayout from "@/components/layout/page-layout"
' "$file"
  
  # Step 2: Remove Sidebar import
  sed -i '' '/import Sidebar from/d' "$file"
  
  # Step 3: Fix the nested PageLayout structure
  sed -i '' '/<div className=".*fixed.*">/,/<\/div>/d' "$file"
  sed -i '' '/<PageLayout>/,/<\/PageLayout>/c\
    <PageLayout>\
      <ComponentPlaceholder />\
    </PageLayout>
' "$file"
  
  # Step 4: Find the component import and insert it properly
  component=$(grep -o "import [A-Za-z]* from '@/components" "$file" | cut -d' ' -f2)
  if [ ! -z "$component" ]; then
    sed -i '' "s/<ComponentPlaceholder \/>/<$component \/>/" "$file"
  fi
  
  echo "Fixed $file"
done < pages_to_fix.txt

echo "All files have been fixed. Please check the files and restart the server." 