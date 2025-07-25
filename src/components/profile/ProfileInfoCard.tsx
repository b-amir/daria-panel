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
      className={`bg-white rounded-md border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-center space-x-4 mb-8">
        <div
          className={`flex items-center rounded-lg justify-center w-10 h-10 bg-gradient-to-r ${iconGradient} shadow-sm`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
