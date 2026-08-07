import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-black">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full border border-brand-border bg-brand-white px-3.5 py-2 text-sm text-brand-black placeholder:text-brand-muted/70 transition-colors focus:border-brand-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-sans",
            error && "border-red-600 focus:border-red-600",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-mono text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
