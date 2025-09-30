import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, type, ...props }, ref) => {
    // Prevent invalid characters in number input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number") {
        if (
          ["e", "E", "+", "-", "."].includes(e.key) // disallow e, +, -, .
        ) {
          e.preventDefault();
        }
      }

      if (props.onKeyDown) props.onKeyDown(e);
    };

    // Prevent scroll change for number type
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        (e.target as HTMLInputElement).blur();
      }
      if (props.onWheel) props.onWheel(e);
    };

    return (
      <input
        type={type}
        className={cn(
          `
            flex h-10 w-full rounded-md border border-input bg-background px-3 py-2
            text-sm ring-offset-background file:border-0 file:bg-transparent
            file:text-sm file:font-medium placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-ring
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-red-500" : "border-gray-200"}
            ${className}
          `
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
