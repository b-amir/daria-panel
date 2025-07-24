import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  className = "flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 pb-0 gap-4 sm:gap-0",
}: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}
