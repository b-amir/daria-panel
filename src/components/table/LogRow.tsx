import { memo, useMemo } from "react";
import { LogEntry, LogType } from "@/types/logs";
import { formatDateTime, formatDateOnly } from "@/utils/formatters";
import { COMMON_STYLES } from "@/constants/commonStyles";
import { Badge, BadgeVariant, Tooltip } from "@/components/ui";
import {
  FiLogIn as LoginIcon,
  FiLogOut as LogoutIcon,
  FiAlertCircle as AlertIcon,
  FiUserPlus as UserPlusIcon,
  FiEye as EyeIcon,
  FiUser as UserIcon,
} from "react-icons/fi";
import { IconType } from "react-icons";

interface LogRowProps {
  log: LogEntry;
}

const LOG_TYPE_CONFIGS: Record<
  LogType,
  { variant: BadgeVariant; icon: IconType }
> = {
  [LogType.LOGIN]: { variant: "success", icon: LoginIcon },
  [LogType.LOGOUT]: { variant: "info", icon: LogoutIcon },
  [LogType.LOGIN_FAILED]: { variant: "error", icon: AlertIcon },
  [LogType.SIGNUP]: { variant: "secondary", icon: UserPlusIcon },
  [LogType.SIGNUP_FAILED]: { variant: "error", icon: AlertIcon },
  [LogType.PAGE_VISIT]: { variant: "default", icon: EyeIcon },
  [LogType.PROFILE_VISIT]: { variant: "default", icon: UserIcon },
};

export const LogRow = memo<LogRowProps>(({ log }) => {
  const badgeConfig = LOG_TYPE_CONFIGS[log.type];

  const formattedTime = useMemo(
    () => ({
      dateTime: formatDateTime(log.time),
      dateOnly: formatDateOnly(log.time),
    }),
    [log.time]
  );

  const badgeElement = (
    <Badge
      variant={badgeConfig.variant}
      icon={badgeConfig.icon}
      className="cursor-help"
    >
      {log.event}
    </Badge>
  );

  return (
    <>
      <div
        className={`w-1/2 md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.responsive.truncate}`}
      >
        <span className={COMMON_STYLES.tableCell.colors.primary}>
          {log.user}
        </span>
      </div>
      <div
        className={`w-1/2 md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm}`}
      >
        {log.details ? (
          <Tooltip content={log.details}>{badgeElement}</Tooltip>
        ) : (
          badgeElement
        )}
      </div>
      <div
        className={`hidden md:block md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.xs} ${COMMON_STYLES.tableCell.colors.muted}`}
      >
        <div>
          <span className="hidden md:inline">{formattedTime.dateTime}</span>
          <span className="md:hidden">{formattedTime.dateOnly}</span>
        </div>
      </div>
    </>
  );
});

LogRow.displayName = "LogRow";
