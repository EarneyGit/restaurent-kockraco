import * as React from 'react';
import { memo, useCallback, useRef } from 'react';
import { Switch } from './switch';

interface StableSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * A stable wrapper around the Switch component to prevent infinite re-render issues
 */
export const StableSwitch = memo(function StableSwitch({
  checked,
  onCheckedChange,
  disabled,
  className,
  id
}: StableSwitchProps) {
  // Use a ref to store the most current callback
  const callbackRef = useRef(onCheckedChange);
  
  // Update the ref when the callback changes
  React.useEffect(() => {
    callbackRef.current = onCheckedChange;
  }, [onCheckedChange]);
  
  // Create a stable callback that uses the ref
  const handleChange = useCallback((checked: boolean) => {
    callbackRef.current(checked);
  }, []);
  
  return (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={handleChange}
      disabled={disabled}
      className={className}
    />
  );
}); 