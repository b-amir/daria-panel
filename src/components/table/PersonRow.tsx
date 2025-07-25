import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/services/users.service";
import { formatPhoneForMobile } from "@/utils/formatters";
import { COMMON_STYLES } from "@/constants/commonStyles";

interface PersonRowProps {
  person: User;
}

export const PersonRow = memo<PersonRowProps>(({ person }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/users/${person.id}`);
  }, [router, person.id]);

  return (
    <div role="row" className="flex items-center w-full h-full">
      <div
        className={`w-1/2 md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.responsive.truncate} cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
        onClick={handleClick}
      >
        <span className={COMMON_STYLES.tableCell.colors.primary}>
          {person.name}
        </span>
      </div>
      <div
        className={`w-1/2 md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
        onClick={handleClick}
      >
        <span
          className={`${COMMON_STYLES.tableCell.colors.muted} ${COMMON_STYLES.tableCell.responsive.breakAll}`}
        >
          {person.email}
        </span>
      </div>
      <div
        className={`hidden md:block md:w-1/3 ${COMMON_STYLES.tableCell.base} ${COMMON_STYLES.tableCell.text.sm} ${COMMON_STYLES.tableCell.colors.secondary} cursor-pointer hover:bg-gray-50 transition-colors duration-150`}
        onClick={handleClick}
      >
        <div>
          <span className="hidden sm:inline">{person.phone}</span>
          <span className="sm:hidden">
            {formatPhoneForMobile(person.phone)}
          </span>
        </div>
      </div>
    </div>
  );
});

PersonRow.displayName = "PersonRow";
