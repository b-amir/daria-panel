interface InfoFieldProps {
  label: string;
  value: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function InfoField({ label, value, href, icon: Icon }: InfoFieldProps) {
  return (
    <div className="group space-y-3">
      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
        {label}
      </label>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 hover:translate-x-1 transform hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-slate-900 leading-relaxed">
          {value}
        </p>
      )}
    </div>
  );
}
