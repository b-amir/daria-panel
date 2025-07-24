"use client";
import { VirtualTable } from "@/components/VirtualTable";
import { PersonRow } from "@/components/PersonRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useOptimizedUsers } from "@/hooks/useOptimizedUsers";
import { USERS_TABLE_COLUMNS } from "@/constants/table-configs";
import { COMMON_STYLES } from "@/constants/styles";

export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    totalCount,
  } = useOptimizedUsers();

  if (isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState error={error} prefix="Error loading users" />;
  }

  return (
    <div className={COMMON_STYLES.fullHeightFlex}>
      <div className={COMMON_STYLES.pageContainer}>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Users
        </h1>
      </div>
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
