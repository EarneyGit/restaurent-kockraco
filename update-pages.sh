#!/bin/bash

# This script helps update pages with duplicate sidebars to use PageLayout
# Run it and review the changes before committing

echo "Updating pages with duplicate sidebars..."

# Find all page.tsx files that might have sidebar issues using various patterns
# Also specifically target directories that we know have issues
PAGES=$(grep -l -e "import Sidebar from \"@/components/layout/sidebar\"" \
              -e "<Sidebar" \
              -e '<main className="flex min-h-screen' \
              -e '<div.*Sidebar.*</div>' \
              src/app/**/page.tsx
         find src/app/careers src/app/deliverymen src/app/notification-settings src/app/payments src/app/reservation src/app/reservations -name "page.tsx" 2>/dev/null
         )

for PAGE in $PAGES; do
  echo "Processing $PAGE..."
  
  # Create a backup
  cp "$PAGE" "${PAGE}.bak"
  
  # First replace the import
  sed -i '' 's/import Sidebar from "@\/components\/layout\/sidebar"/import PageLayout from "@\/components\/layout\/page-layout"/' "$PAGE"
  
  # Check if the page still has "Sidebar" but not "PageLayout" import
  if ! grep -q "import PageLayout from" "$PAGE" && grep -q "Sidebar" "$PAGE"; then
    echo "Adding PageLayout import to $PAGE..."
    sed -i '' '1,10s/import React/import React from "react"\nimport PageLayout from "@\/components\/layout\/page-layout"/' "$PAGE"
  fi
  
  # Handle different layout patterns based on HTML structure
  if grep -q '<main className="flex min-h-screen' "$PAGE"; then
    echo "Fixing main layout in $PAGE..."
    sed -i '' -E 's/<main className="flex min-h-screen[^>]*>/<PageLayout>/' "$PAGE"
    sed -i '' -E 's/<\/main>/<\/PageLayout>/' "$PAGE"
  fi
  
  # Handle sidebar in div patterns
  if grep -q '<div.*<Sidebar' "$PAGE"; then
    echo "Fixing div with Sidebar in $PAGE..."
    # Find the div that contains Sidebar and replace with PageLayout
    sed -i '' -E 's/<div[^>]*>.*<Sidebar[^>]*>.*<\/div>.*<div[^>]*>/<PageLayout>/' "$PAGE"
    # Close the PageLayout component at the end
    sed -i '' -E 's/<\/div>[^<]*<\/main>/<\/PageLayout>/' "$PAGE"
  fi
  
  # Handle other patterns of layout structure
  if grep -q 'className="flex-1 ml' "$PAGE"; then
    echo "Fixing flex layout in $PAGE..."
    sed -i '' -E 's/<div className="flex-1 ml[^>]*>/<PageLayout>/' "$PAGE"
    sed -i '' -E 's/<\/div>[^<]*<\/main>/<\/PageLayout>/' "$PAGE"
  fi
  
  # More aggressive approach for specific directories we know have issues
  if [[ "$PAGE" =~ careers|deliverymen|notification-settings|payments|reservation|reservations ]]; then
    echo "Special handling for $PAGE..."
    # Replace everything between main tag with PageLayout
    sed -i '' -E 's/<main[^>]*>.*<Sidebar[^>]*>.*<\/div>.*<div[^>]*>/<PageLayout>/g' "$PAGE"
    sed -i '' -E 's/<div[^>]*>.*<Sidebar[^>]*>.*<\/div>.*<div[^>]*>/<PageLayout>/g' "$PAGE"
    sed -i '' -E 's/<\/div>[^<]*<\/main>/<\/PageLayout>/g' "$PAGE"
  fi
  
  # Final check if the file still contains a reference to Sidebar component after all replacements
  if grep -q "<Sidebar" "$PAGE" || grep -q "<main" "$PAGE"; then
    echo "Found Sidebar/main references still in $PAGE - doing final aggressive replacements..."
    # Very aggressive replacement - convert any main > div > Sidebar > /div > div pattern to PageLayout
    sed -i '' -E 's/<main[^>]*>.*<div[^>]*>.*<Sidebar[^>]*>.*<\/div>/<PageLayout>/g' "$PAGE"
    sed -i '' -E 's/<\/div>[^<]*<\/main>/<\/PageLayout>/g' "$PAGE"
    
    # Completely different approach for final fallback - remove all old structure and just wrap content in PageLayout
    CONTENT=$(sed -n '/<div.*flex-1/,/<\/main>/p' "$PAGE" | sed '1d;$d')
    if [ -n "$CONTENT" ]; then
      echo "Using extracted content approach for $PAGE..."
      sed -i '' -E "/<div.*flex-1/,/<\/main>/c\\
    <PageLayout>\\
    $CONTENT\\
    </PageLayout>" "$PAGE"
    fi
  fi
    
  echo "Updated $PAGE"
done

echo "Done! Please review the changes and run the application to verify." 