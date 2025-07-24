import { memo } from "react";
import { User } from "@/services/users.service";
import { formatPhoneForMobile } from "@/utils/formatters";
import { COMMON_STYLES } from "@/constants/commonStyles";
import {
  USERS_TABLE_COLUMNS,
  getFlexClassFromWidth,
} from "@/constants/tableConfigs";

interface PersonRowProps {
  person: User;
}

export const PersonRow = memo<PersonRowProps>(({ person }) => {
  const [nameColumn, emailColumn, phoneColumn] = USERS_TABLE_COLUMNS;

  return (
    <>
      <div
        className={`${getFlexClassFromWidth(nameColumn.width)} ${
          COMMON_STYLES.tableCell.base
        } ${COMMON_STYLES.tableCell.text.sm} ${
          COMMON_STYLES.tableCell.responsive.truncate
        }`}
      >
        <span className={COMMON_STYLES.tableCell.colors.primary}>
          {person.name}
        </span>
      </div>
      <div
        className={`${getFlexClassFromWidth(emailColumn.width)} ${
          COMMON_STYLES.tableCell.base
        } ${COMMON_STYLES.tableCell.text.sm}`}
      >
        <span
          className={`${COMMON_STYLES.tableCell.colors.link} ${COMMON_STYLES.tableCell.responsive.breakAll}`}
        >
          {person.email}
        </span>
      </div>
      <div
        className={`${getFlexClassFromWidth(phoneColumn.width)} ${
          COMMON_STYLES.tableCell.base
        } ${COMMON_STYLES.tableCell.text.sm} ${
          COMMON_STYLES.tableCell.colors.secondary
        }`}
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
