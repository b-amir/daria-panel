import { ReactNode } from "react";
import { COMMON_STYLES } from "@/constants/commonStyles";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  action,
  className = `${COMMON_STYLES.pageContainer} ${COMMON_STYLES.heights.pageTitle} flex items-center justify-between border-b border-gray-300 shadow-sm bg-gradient-to-t from-white via-gray-100 to-gray-100`,
}: PageHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
