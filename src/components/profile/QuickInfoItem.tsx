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
      className={`flex justify-between items-center py-3 ${
        !isLast ? "border-b border-slate-200" : ""
      }`}
    >
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1">
        {value}
      </span>
    </div>
  );
}
