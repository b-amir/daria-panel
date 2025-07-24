"use client";
import { VirtualTable } from "@/components/table/VirtualTable";
import { PersonRow } from "@/components/table/PersonRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useUsers } from "@/hooks/useUsers";
import { USERS_TABLE_COLUMNS } from "@/constants/tableConfigs";
import { COMMON_STYLES } from "@/constants/commonStyles";

export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    totalCount,
  } = useUsers();

  if (isLoading) {
    return <LoadingState message="Loading users" />;
  }

  if (error) {
    return <ErrorState error={error} prefix="Error loading users" />;
  }

  return (
    <div className={`${COMMON_STYLES.fullHeightFlex} h-screen`}>
      <PageHeader title="Users" />

      <div className={`flex-1 overflow-hidden`}>
        <VirtualTable
          title=""
          columns={USERS_TABLE_COLUMNS}
          data={users}
          renderRow={(person) => <PersonRow person={person} />}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={loadNextPage}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
