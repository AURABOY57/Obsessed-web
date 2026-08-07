import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono uppercase tracking-widest text-xs font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none border select-none cursor-pointer";

    const variants = {
      primary:
        "bg-brand-black text-brand-white border-brand-black hover:bg-brand-white hover:text-brand-black",
      secondary:
        "bg-brand-surface text-brand-black border-brand-border hover:border-brand-black",
      outline:
        "bg-transparent text-brand-black border-brand-black hover:bg-brand-black hover:text-brand-white",
      ghost:
        "bg-transparent text-brand-black border-transparent hover:bg-brand-surface",
      danger:
        "bg-transparent text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-[10px]",
      md: "h-11 px-6 text-xs",
      lg: "h-14 px-8 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Cargando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
