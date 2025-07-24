import { memo } from "react";
import { LogEntry } from "@/services/logs.service";
import { formatDateTime, formatDateOnly } from "@/utils/formatters";
import { COMMON_STYLES } from "@/constants/commonStyles";

interface LogRowProps {
  log: LogEntry;
}

export const LogRow = memo<LogRowProps>(({ log }) => {
  return (
    <>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.responsive.truncate}`}
      >
        <span className={COMMON_STYLES.tableCell.colors.primary}>
          {log.user}
        </span>
      </div>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm}`}
      >
        <span
          className={`${COMMON_STYLES.tableCell.colors.secondary} ${COMMON_STYLES.tableCell.responsive.breakWords}`}
        >
          {log.event}
        </span>
      </div>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.xs} ${COMMON_STYLES.tableCell.colors.muted}`}
      >
        <div>
          <span className="hidden md:inline">{formatDateTime(log.time)}</span>
          <span className="md:hidden">{formatDateOnly(log.time)}</span>
        </div>
      </div>
    </>
  );
});

LogRow.displayName = "LogRow";
