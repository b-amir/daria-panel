"use client";
import { VirtualTable } from "@/components/table/VirtualTable";
import { LogRow } from "@/components/table/LogRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useLogs } from "@/hooks/useLogs";
import { LOGS_TABLE_COLUMNS } from "@/constants/tableConfigs";
import { COMMON_STYLES } from "@/constants/commonStyles";

export default function LogsPage() {
  const {
    logs,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
  } = useLogs();

  if (isLoading) {
    return <LoadingState message="Loading logs" />;
  }

  if (error) {
    return <ErrorState error={error} prefix="Error loading logs" />;
  }

  return (
    <div className={`${COMMON_STYLES.fullHeightFlex} h-screen`}>
      <PageHeader title="Logs" />

      <div className={`flex-1 overflow-hidden`}>
        <VirtualTable
          title=""
          columns={LOGS_TABLE_COLUMNS}
          data={logs}
          renderRow={(log) => <LogRow log={log} />}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={loadNextPage}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
