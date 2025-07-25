import { ReactNode } from "react";
import { IconType } from "react-icons";

export type BadgeVariant =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "secondary"
  | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: IconType;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  secondary: "bg-purple-100 text-purple-800 border-purple-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export function Badge({
  children,
  variant = "default",
  icon: Icon,
  className = "",
}: BadgeProps) {
  const variantClasses = badgeVariants[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
