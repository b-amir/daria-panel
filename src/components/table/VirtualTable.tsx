import { ReactNode, useRef, useCallback, memo, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { Column, ROW_HEIGHT } from "@/constants/tableConfigs";
import { useListHeight } from "@/components/table/hooks/useListHeight";
import {
  TableHeader,
  TableColumnHeaders,
  TableFooter,
  LoadMoreRow,
  DataRow,
} from "./TableComponents";

type VirtualTableProps<T> = {
  title: string;
  columns: Column[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => Promise<void>;
  totalCount: number;
};

const VirtualTableComponent = <T,>({
  title,
  columns,
  data,
  renderRow,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  totalCount,
}: VirtualTableProps<T>) => {
  const listRef = useRef<List>(null);
  const listHeight = useListHeight();

  const paginationProps = useMemo(
    () => ({
      hasNextPage,
      isNextPageLoading,
      loadNextPage,
    }),
    [hasNextPage, isNextPageLoading, loadNextPage]
  );

  const handleLoadMore = useCallback(() => {
    if (paginationProps.hasNextPage && !paginationProps.isNextPageLoading) {
      paginationProps.loadNextPage().catch((error) => {
        console.error("Failed to load more data:", error);
      });
    }
  }, [paginationProps]);

  const itemCount = paginationProps.hasNextPage ? data.length + 1 : data.length;

  const renderVirtualRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const isLoadMoreRow =
        index === data.length && paginationProps.hasNextPage;

      if (isLoadMoreRow) {
        return (
          <LoadMoreRow
            style={style}
            isLoading={paginationProps.isNextPageLoading}
            onLoadMore={handleLoadMore}
          />
        );
      }

      const item = data[index];
      if (!item) return <div style={style} />;

      return <DataRow style={style}>{renderRow(item)}</DataRow>;
    },
    [data, renderRow, paginationProps, handleLoadMore]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <TableHeader title={title} />
      <TableColumnHeaders columns={columns} />

      <div className="flex-1 overflow-hidden min-h-0">
        {listHeight > 0 && (
          <List
            ref={listRef}
            height={listHeight}
            itemCount={itemCount}
            itemSize={ROW_HEIGHT}
            width="100%"
          >
            {renderVirtualRow}
          </List>
        )}
      </div>

      <TableFooter
        dataLength={data.length}
        totalCount={totalCount}
        isLoading={paginationProps.isNextPageLoading}
      />
    </div>
  );
};

export const VirtualTable = memo(
  VirtualTableComponent
) as typeof VirtualTableComponent;
