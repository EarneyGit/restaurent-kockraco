#!/bin/bash

# Process each file listed in pages_to_fix.txt
while IFS= read -r file; do
  echo "Processing $file..."
  
  # Create backup
  cp "$file" "$file.bak"
  
  # Add use client directive if missing
  if ! grep -q "use client" "$file"; then
    sed -i '' '1i\
"use client"\
' "$file"
  fi
  
  # Add React import if missing
  if ! grep -q "import React" "$file"; then
    sed -i '' '2i\
import React from "react"\
' "$file"
  fi
  
  # Add PageLayout import if missing
  if ! grep -q "import PageLayout" "$file"; then
    sed -i '' '3i\
import PageLayout from "@/components/layout/page-layout"\
' "$file"
  fi
  
  # Remove Sidebar import
  sed -i '' '/import Sidebar from/d' "$file"
  
  # Extract the main component name from import statements
  component=$(grep -o "import [A-Za-z]* from '@/components" "$file" | head -1 | cut -d' ' -f2)
  
  # Replace the entire return statement with a simplified version
  perl -i -0pe 's/return\s*\(\s*<PageLayout>.*?<\/PageLayout>\s*\)/return (\n    <PageLayout>\n      <'"$component"' \/>\n    <\/PageLayout>\n  )/s' "$file"
  
  echo "Fixed $file"
done < pages_to_fix.txt

echo "All files have been fixed. Please check the files and restart the server." 