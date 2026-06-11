"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800 shadow",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow",
  outline: "border border-slate-200 bg-white hover:bg-slate-100 text-black",
  secondary: "bg-slate-100 text-black hover:bg-slate-200",
  ghost: "hover:bg-slate-100 text-black",
  link: "text-slate-900 underline-offset-4 hover:underline",
};

const sizeStyles: Record<string, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-8 text-base",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };