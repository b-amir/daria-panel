import { ReactNode } from "react";

interface ProfileInfoCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconGradient: string;
  children: ReactNode;
  className?: string;
}

export function ProfileInfoCard({
  title,
  icon: Icon,
  iconGradient,
  children,
  className = "",
}: ProfileInfoCardProps) {
  return (
    <div
      className={`py-6 sm:py-8 border-b border-slate-200 last:border-b-0 ${className}`}
    >
      <div className="flex items-center space-x-3 mb-6 sm:mb-8">
        <div
          className={`flex items-center rounded-xs justify-center w-8 h-8 bg-gradient-to-r ${iconGradient}`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
