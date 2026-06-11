import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-black",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-200 text-black",
  success: "bg-green-100 text-green-800 border border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
};

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge, type BadgeProps };