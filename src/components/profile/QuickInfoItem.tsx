interface QuickInfoItemProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export function QuickInfoItem({
  label,
  value,
  isLast = false,
}: QuickInfoItemProps) {
  return (
    <div
      className={`flex justify-between items-center py-1 ${
        !isLast ? "border-b border-slate-200" : ""
      }`}
    >
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-bold text-slate-900  hover:bg-slate-200 transition-colors duration-200 px-3 py-1 rounded-lg">
        {value}
      </span>
    </div>
  );
}
