import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StableSwitch } from '@/components/ui/stable-switch';
import { cn } from '@/lib/utils';
import { Checkbox } from '@radix-ui/react-checkbox';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId?: string; // Added categoryId for grouping
}

interface Category {
  id: string;
  name: string;
  productCount?: number; // Added to match API response
  items: MenuItem[];
}

interface MenuItemsTabProps {
  items: MenuItem[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onSettingsChange: (settings: MenuItemSettings) => void;
  settings: MenuItemSettings;
  categories?: Category[]; // Optional list of categories
}

interface MenuItemSettings {
  showSelectedOnly: boolean;
  showSelectedCategories: boolean;
  limitSingleChoice: boolean;
  addAttributeCharges: boolean;
  useProductPrices: boolean;
  showChoiceAsDropdown: boolean;
}

export const MenuItemsTab: React.FC<MenuItemsTabProps> = React.memo(({
  items,
  selectedItems,
  onItemSelect,
  onSettingsChange,
  settings,
  categories = [], // Default to empty array
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Debug logging with better formatting
  useEffect(() => {
    console.log("MenuItemsTab received props - selected items:", selectedItems);
    console.log("MenuItemsTab received props - settings:", {
      showSelectedOnly: settings.showSelectedOnly === true,
      showSelectedCategories: settings.showSelectedCategories === true, 
      limitSingleChoice: settings.limitSingleChoice === true,
      addAttributeCharges: settings.addAttributeCharges === true,
      useProductPrices: settings.useProductPrices === true,
      showChoiceAsDropdown: settings.showChoiceAsDropdown === true
    });
  }, [selectedItems, settings]);

  // Memoize items and categories to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [JSON.stringify(items.map(item => item.id))]);
  const memoizedCategories = useMemo(() => categories, [JSON.stringify(categories.map(cat => cat.id))]);
  const memoizedSelectedItems = useMemo(() => selectedItems || [], [JSON.stringify(selectedItems)]);

  // Use a ref to track if we've already fetched categories to prevent multiple fetches
  const hasFetchedRef = React.useRef(false);

  // Fetch categories from the API
  useEffect(() => {
    // Skip fetch if we've already done it once or the component is unmounting
    if (hasFetchedRef.current) return;
    
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        if (data.success) {
          // Map API response to component format
          const fetchedCategories = data.data.map((category: any) => {
            const categoryId = category._id || category.id;
            const categoryItems = memoizedItems.filter(item => 
              item.categoryId === categoryId
            );
            
            return {
              id: categoryId,
              name: category.name,
              productCount: categoryItems.length,
              items: categoryItems
            };
          }).filter(category => category.items.length > 0); // Only include categories with items
          
          console.log("Processed categories:", fetchedCategories);
          setAllCategories(fetchedCategories);
          
          // Initialize expanded categories based on selected items
          const expanded: Record<string, boolean> = {};
          if (memoizedSelectedItems.length > 0) {
            // Find categories that have selected items and expand them
            fetchedCategories.forEach(category => {
              const hasSelectedItems = category.items.some(item => 
                memoizedSelectedItems.includes(item.id)
              );
              if (hasSelectedItems) {
                expanded[category.id] = true;
              }
            });
            setExpandedCategories(expanded);
          }
          
          console.log("Initial expanded categories:", expanded);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        // If API fails, use provided categories or create a default one
        if (memoizedCategories.length > 0) {
          setAllCategories(memoizedCategories);
        } else {
          // Group items by categoryId
          const categoriesMap: Record<string, MenuItem[]> = {};
          memoizedItems.forEach(item => {
            if (item.categoryId) {
              if (!categoriesMap[item.categoryId]) {
                categoriesMap[item.categoryId] = [];
              }
              categoriesMap[item.categoryId].push(item);
            }
          });
          
          // Convert map to array of categories
          const fallbackCategories = Object.entries(categoriesMap).map(([id, items]) => ({
            id,
            name: `Category ${id.substring(0, 5)}...`,
            items,
            productCount: items.length
          }));
          
          if (fallbackCategories.length > 0) {
            setAllCategories(fallbackCategories);
          } else {
            setAllCategories([
              {
                id: 'default',
                name: 'All Items',
                items: memoizedItems,
                productCount: memoizedItems.length
              }
            ]);
          }
        }
      } finally {
        setLoadingCategories(false);
        hasFetchedRef.current = true;
      }
    };

    fetchCategories();
  }, [memoizedItems, memoizedCategories, memoizedSelectedItems]); // Added dependencies

  // Reset hasFetchedRef when items change significantly
  useEffect(() => {
    if (memoizedItems.length > 0) {
      hasFetchedRef.current = false;
    }
  }, [memoizedItems.length]);

  // Use proper boolean handling when initializing handlers
  const handleSettingChange = useCallback((key: keyof MenuItemSettings) => {
    console.log(`Changing setting ${key} from ${Boolean(settings[key])} to ${!Boolean(settings[key])}`);
    
    // Create a fresh copy of settings with explicitly set boolean values
    const newSettings: MenuItemSettings = {
      showSelectedOnly: Boolean(settings.showSelectedOnly),
      showSelectedCategories: Boolean(settings.showSelectedCategories),
      limitSingleChoice: Boolean(settings.limitSingleChoice),
      addAttributeCharges: Boolean(settings.addAttributeCharges),
      useProductPrices: Boolean(settings.useProductPrices),
      showChoiceAsDropdown: Boolean(settings.showChoiceAsDropdown)
    };
    
    // Toggle the specific setting
    newSettings[key] = !Boolean(settings[key]);
    
    console.log("New settings after change:", newSettings);
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  // Debug log for current settings
  useEffect(() => {
    console.log("Current menu item settings:", settings);
  }, [settings]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Select all items in a category
  const selectAllInCategory = useCallback((categoryItems: MenuItem[]) => {
    const itemIds = categoryItems.map(item => item.id);
    itemIds.forEach(id => {
      if (!memoizedSelectedItems.includes(id)) {
        onItemSelect(id);
      }
    });
  }, [memoizedSelectedItems, onItemSelect]);

  // Deselect all items in a category
  const deselectAllInCategory = useCallback((categoryItems: MenuItem[]) => {
    const itemIds = categoryItems.map(item => item.id);
    itemIds.forEach(id => {
      if (memoizedSelectedItems.includes(id)) {
        onItemSelect(id);
      }
    });
  }, [memoizedSelectedItems, onItemSelect]);

  // Memoize handlers for each switch to prevent re-renders
  const handleShowSelectedCategoriesChange = useCallback(() => {
    handleSettingChange('showSelectedCategories');
  }, [handleSettingChange]);

  const handleShowSelectedOnlyChange = useCallback(() => {
    handleSettingChange('showSelectedOnly');
  }, [handleSettingChange]);

  const handleLimitSingleChoiceChange = useCallback(() => {
    handleSettingChange('limitSingleChoice');
  }, [handleSettingChange]);

  const handleAddAttributeChargesChange = useCallback(() => {
    handleSettingChange('addAttributeCharges');
  }, [handleSettingChange]);

  const handleUseProductPricesChange = useCallback(() => {
    handleSettingChange('useProductPrices');
  }, [handleSettingChange]);

  const handleShowChoiceAsDropdownChange = useCallback(() => {
    handleSettingChange('showChoiceAsDropdown');
  }, [handleSettingChange]);

  // Filter categories based on settings
  const filteredCategories = useMemo(() => {
    console.log("Filtering categories with settings:", {
      showSelectedCategories: Boolean(settings.showSelectedCategories)
    });
    console.log("All categories:", allCategories);
    
    if (Boolean(settings.showSelectedCategories)) {
      return allCategories.filter(category => 
        category.items.some(item => memoizedSelectedItems.includes(item.id))
      );
    }
    return allCategories;
  }, [allCategories, settings.showSelectedCategories, memoizedSelectedItems]);

  // Memoize the filtered items for better performance
  const filteredItems = useMemo(() => {
    return memoizedItems.filter(item => memoizedSelectedItems.includes(item.id));
  }, [memoizedItems, memoizedSelectedItems]);

  // Get items for a specific category
  const getItemsForCategory = useCallback((categoryId: string) => {
    return memoizedItems.filter(item => item.categoryId === categoryId);
  }, [memoizedItems]);

  // Get selected items count for a category
  const getSelectedCountForCategory = useCallback((categoryId: string) => {
    return memoizedItems.filter(item => 
      item.categoryId === categoryId && memoizedSelectedItems.includes(item.id)
    ).length;
  }, [memoizedItems, memoizedSelectedItems]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm text-gray-600">Show only categories with selected items</span>
        <StableSwitch
          checked={Boolean(settings.showSelectedCategories)}
          onCheckedChange={handleShowSelectedCategoriesChange}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm text-gray-600">Show only selected items</span>
        <StableSwitch
          checked={Boolean(settings.showSelectedOnly)}
          onCheckedChange={handleShowSelectedOnlyChange}
        />
      </div>

      {loadingCategories ? (
        <div className="text-center p-8">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center p-8">No categories available</div>
      ) : Boolean(settings.showSelectedOnly) && filteredItems.length === 0 ? (
        <div className="text-center p-8">No items selected yet</div>
      ) : Boolean(settings.showSelectedOnly) ? (
        // Show flat list of only selected items
        <div className="border rounded-lg">
          {filteredCategories.map((category) => {
            const selectedItemsInCategory = memoizedItems.filter(
              item => item.categoryId === category.id && memoizedSelectedItems.includes(item.id)
            );
            
            if (selectedItemsInCategory.length === 0) return null;
            
            const isExpanded = expandedCategories[category.id];
            const selectedCount = getSelectedCountForCategory(category.id);
            const totalCount = category.productCount || getItemsForCategory(category.id).length;
            
            return (
              <div key={category.id} className="border-b last:border-b-0">
                <div 
                  className={`flex items-center justify-between p-4 ${isExpanded ? 'border-b' : ''}`}
                >
                  <div className="flex items-center">
                    <span className="text-gray-600">
                      {category.name}
                    </span>
                    <span className="ml-2 text-gray-500">({selectedCount}/{totalCount})</span>
                    <StableSwitch
                      className="ml-2"
                      checked={selectedCount > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllInCategory(getItemsForCategory(category.id));
                        } else {
                          deselectAllInCategory(getItemsForCategory(category.id));
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center"
                    >
                      <span className="mr-2">{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div>
                    {selectedItemsInCategory.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-3 p-4 border-b last:border-b-0"
                      >
                        <div>
                          <StableSwitch
                            checked={true}
                            onCheckedChange={() => onItemSelect(item.id)}
                          />
                        </div>
                        <div className="text-gray-600">{item.name}</div>
                        <div className="font-medium">£{item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Show categories with items
      <div className="border rounded-lg">
          {filteredCategories.map((category) => {
            const categoryItems = getItemsForCategory(category.id);
            const selectedCount = getSelectedCountForCategory(category.id);
            const totalCount = category.productCount || categoryItems.length;
            const isExpanded = expandedCategories[category.id];
            
            return (
              <div key={category.id} className="border-b last:border-b-0">
                {/* Category header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-gray-500">({selectedCount}/{totalCount})</span>
                    <StableSwitch
                      checked={selectedCount > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllInCategory(categoryItems);
                        } else {
                          deselectAllInCategory(categoryItems);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Expand/collapse button */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center"
                    >
                      <span className="mr-2">{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Category items (shown when expanded) */}
                {isExpanded && (
                  <div>
                    {categoryItems.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No items in this category</div>
                    ) : Boolean(settings.showSelectedOnly) ? (
                      // Show only selected items in this category
                      categoryItems
                        .filter(item => memoizedSelectedItems.includes(item.id))
                        .map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border-t bg-gray-50"
                          >
                            <div className="flex items-center space-x-4 ml-8">
                              <StableSwitch
                                checked={true}
                                onCheckedChange={() => onItemSelect(item.id)}
                              />
                              <span className="text-gray-600">{item.name}</span>
                            </div>
                            <span className="font-medium">£{item.price.toFixed(2)}</span>
                          </div>
                        ))
                    ) : (
                      // Show all items in this category
                      categoryItems.map(item => (
          <div
            key={item.id}
            className={cn(
                            'flex items-center justify-between p-4 border-t',
                            memoizedSelectedItems.includes(item.id) ? 'bg-gray-50' : ''
                          )}
                        >
                          <div className="flex items-center space-x-4 ml-8">
                            <StableSwitch
                              checked={memoizedSelectedItems.includes(item.id)}
                onCheckedChange={() => onItemSelect(item.id)}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-medium">£{item.price.toFixed(2)}</span>
          </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      )}

      <div className="space-y-4 mt-6">
        <div className="flex items-center space-x-2">
          <StableSwitch
            checked={Boolean(settings.limitSingleChoice)}
            onCheckedChange={handleLimitSingleChoiceChange}
          />
          <span className="text-sm text-gray-600">Limit to single choice?</span>
        </div>

        <div className="flex items-center space-x-2">
          <StableSwitch
            checked={Boolean(settings.addAttributeCharges)}
            onCheckedChange={handleAddAttributeChargesChange}
          />
          <span className="text-sm text-gray-600">Add attribute charges?</span>
        </div>

        <div className="flex items-center space-x-2">
          <StableSwitch
            checked={Boolean(settings.useProductPrices)}
            onCheckedChange={handleUseProductPricesChange}
          />
          <span className="text-sm text-gray-600">
            Use the prices of the product selected in the group? (The price on the Group item will be ignored)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <StableSwitch
            checked={Boolean(settings.showChoiceAsDropdown)}
            onCheckedChange={handleShowChoiceAsDropdownChange}
          />
          <span className="text-sm text-gray-600">Show choice as dropdown?</span>
        </div>
      </div>
    </div>
  );
}); 