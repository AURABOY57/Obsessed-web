import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "active" | "inactive";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-brand-black text-brand-white border-brand-black",
    outline: "bg-transparent text-brand-black border-brand-border",
    active: "bg-green-50 text-green-900 border-green-200",
    inactive: "bg-neutral-100 text-neutral-500 border-neutral-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
