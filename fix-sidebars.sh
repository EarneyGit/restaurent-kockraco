#!/bin/bash

# This script directly replaces all Sidebar components with PageLayout
# It's more aggressive in fixing the issues

echo "Fixing all sidebar issues..."

# Find all page.tsx files with potential sidebar issues
PAGES=$(grep -l -e "<Sidebar" -e '<main className="flex min-h-screen' -e '<div.*<Sidebar.*</div>' src/app/**/page.tsx)

for PAGE in $PAGES; do
  echo "Processing $PAGE..."
  
  # Create a backup
  cp "$PAGE" "${PAGE}.bak"
  
  # Add PageLayout import if needed
  if ! grep -q "import PageLayout from" "$PAGE"; then
    sed -i '' '1,10s/import React/import React from "react"\nimport PageLayout from "@\/components\/layout\/page-layout"/' "$PAGE"
  fi
  
  # Find the main component that's being rendered
  MAIN_COMPONENT=$(grep -o -m 1 '<[A-Za-z][A-Za-z]*\s*\/*>' "$PAGE" | grep -v "main\|div\|Sidebar\|PageLayout" | head -1)
  
  if [ -n "$MAIN_COMPONENT" ]; then
    echo "Found main component: $MAIN_COMPONENT"
    # Replace the entire JSX structure with a simple PageLayout wrapping the main component
    sed -i '' -E "s/<main[^>]*>.*<\/main>/<PageLayout>\n      $MAIN_COMPONENT\n    <\/PageLayout>/" "$PAGE"
  else
    # Fall back to a more aggressive approach
    sed -i '' -E 's/<main[^>]*>.*<\/main>/<PageLayout>\n      {\/\* Content goes here \*\/}\n    <\/PageLayout>/' "$PAGE"
  fi
  
  echo "Updated $PAGE"
done

echo "Done! Please review the changes and run the application to verify." 