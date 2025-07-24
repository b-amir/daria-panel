import { memo } from "react";
import { User } from "@/services/users.service";
import { formatPhoneForMobile } from "@/utils/formatters";
import { COMMON_STYLES } from "@/constants/commonStyles";

interface PersonRowProps {
  person: User;
}

export const PersonRow = memo<PersonRowProps>(({ person }) => {
  return (
    <>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.responsive.truncate}`}
      >
        <span className={COMMON_STYLES.tableCell.colors.primary}>
          {person.name}
        </span>
      </div>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm}`}
      >
        <span
          className={`${COMMON_STYLES.tableCell.colors.muted} ${COMMON_STYLES.tableCell.responsive.breakAll}`}
        >
          {person.email}
        </span>
      </div>
      <div
        className={`flex-1 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.colors.secondary}`}
      >
        <div>
          <span className="hidden sm:inline">{person.phone}</span>
          <span className="sm:hidden">
            {formatPhoneForMobile(person.phone)}
          </span>
        </div>
      </div>
    </>
  );
});

PersonRow.displayName = "PersonRow";
