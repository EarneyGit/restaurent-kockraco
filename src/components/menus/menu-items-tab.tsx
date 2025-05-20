import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Checkbox } from '@radix-ui/react-checkbox';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuItemsTabProps {
  items: MenuItem[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onSettingsChange: (settings: MenuItemSettings) => void;
  settings: MenuItemSettings;
}

interface MenuItemSettings {
  showSelectedOnly: boolean;
  showSelectedCategories: boolean;
  limitSingleChoice: boolean;
  addAttributeCharges: boolean;
  useProductPrices: boolean;
  showChoiceAsDropdown: boolean;
}

export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({
  items,
  selectedItems,
  onItemSelect,
  onSettingsChange,
  settings,
}) => {
  const handleSettingChange = (key: keyof MenuItemSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const filteredItems = settings.showSelectedOnly
    ? items.filter((item) => selectedItems.includes(item.id))
    : items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm text-gray-600">Show only categories with selected items</span>
        <Switch
          checked={settings.showSelectedCategories}
          onCheckedChange={() => handleSettingChange('showSelectedCategories')}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm text-gray-600">Show only selected items</span>
        <Switch
          checked={settings.showSelectedOnly}
          onCheckedChange={() => handleSettingChange('showSelectedOnly')}
        />
      </div>

      <div className="border rounded-lg">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between p-4 border-b last:border-b-0',
              selectedItems.includes(item.id) ? 'bg-gray-50' : ''
            )}
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => onItemSelect(item.id)}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-medium">£{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.limitSingleChoice}
            onCheckedChange={() => handleSettingChange('limitSingleChoice')}
          />
          <span className="text-sm text-gray-600">Limit to single choice?</span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.addAttributeCharges}
            onCheckedChange={() => handleSettingChange('addAttributeCharges')}
          />
          <span className="text-sm text-gray-600">Add attribute charges?</span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.useProductPrices}
            onCheckedChange={() => handleSettingChange('useProductPrices')}
          />
          <span className="text-sm text-gray-600">
            Use the prices of the product selected in the group? (The price on the Group item will be ignored)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.showChoiceAsDropdown}
            onCheckedChange={() => handleSettingChange('showChoiceAsDropdown')}
          />
          <span className="text-sm text-gray-600">Show choice as dropdown?</span>
        </div>
      </div>
    </div>
  );
}; 