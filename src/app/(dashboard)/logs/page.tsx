"use client";
import { VirtualTable } from "@/components/VirtualTable";
import { LogRow } from "@/components/LogRow";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useOptimizedLogs } from "@/hooks/useOptimizedLogs";
import { LOGS_TABLE_COLUMNS } from "@/constants/table-configs";
import { COMMON_STYLES } from "@/constants/styles";
import { Button } from "@mui/material";
import { FiRefreshCw } from "react-icons/fi";
import { memo } from "react";

interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton = memo<RefreshButtonProps>(({ onClick }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<FiRefreshCw className="w-4 h-4" />}
      className="text-blue-600 border-blue-600 hover:bg-blue-50 text-sm md:text-base whitespace-nowrap"
    >
      <span className="hidden sm:inline">Refresh</span>
      <span className="sm:hidden">
        <FiRefreshCw className="w-4 h-4" />
      </span>
    </Button>
  );
});

RefreshButton.displayName = "RefreshButton";

export default function LogsPage() {
  const {
    logs,
    totalCount,
    isLoading,
    error,
    hasNextPage,
    isNextPageLoading,
    handleRefresh,
    loadNextPage,
  } = useOptimizedLogs();

  if (isLoading) {
    return <LoadingState message="Loading logs..." />;
  }

  if (error) {
    return <ErrorState error={error} prefix="Error loading logs" />;
  }

  return (
    <div className={COMMON_STYLES.fullHeightFlex}>
      <PageHeader
        title="Logs"
        action={<RefreshButton onClick={handleRefresh} />}
      />
      <div className={`flex-1 ${COMMON_STYLES.sectionSpacing} overflow-hidden`}>
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
