import { Typography, CircularProgress } from "@mui/material";
import {
  ReactNode,
  useRef,
  useCallback,
  memo,
  useState,
  useEffect,
} from "react";
import { FixedSizeList as List } from "react-window";
import { Column, getFlexClassFromWidth } from "@/constants/table-configs";
import { COMMON_STYLES } from "@/constants/styles";
import { FiRefreshCw } from "react-icons/fi";

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

const ROW_HEIGHT = 48;

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
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    setListHeight(window.innerHeight - 180);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isNextPageLoading) {
      loadNextPage();
    }
  }, [hasNextPage, isNextPageLoading, loadNextPage]);

  const itemCount = hasNextPage ? data.length + 1 : data.length;

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (index === data.length && hasNextPage) {
        return (
          <div
            style={style}
            className="flex items-center justify-center border-b border-gray-200 bg-blue-50 hover:bg-blue-100  cursor-pointer transition-colors"
            onClick={handleLoadMore}
          >
            <div className="flex items-center justify-center w-full h-full text-blue-600 hover:text-blue-700 font-medium">
              {isNextPageLoading ? (
                <>
                  <CircularProgress size={16} className="mr-2 text-blue-600" />
                  Loading more
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Load More
                </>
              )}
            </div>
          </div>
        );
      }

      const item = data[index];

      if (!item) {
        return <div style={style} />;
      }

      return (
        <div
          style={style}
          className="flex items-center border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex w-full items-center h-full">
            {renderRow(item)}
          </div>
        </div>
      );
    },
    [data, renderRow, hasNextPage, isNextPageLoading, handleLoadMore]
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {title && (
        <div className="flex-shrink-0">
          <Typography
            variant="h6"
            className="px-4 py-8 pb-6 font-bold border-b border-gray-300 bg-gray-50 text-lg md:text-xl"
          >
            {title}
          </Typography>
        </div>
      )}

      <div className="flex-shrink-0">
        <div className="flex items-center bg-gray-100 shadow-inner border-b border-gray-200">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${getFlexClassFromWidth(column.width)} ${
                COMMON_STYLES.tableCell.base
              } uppercase font-bold text-xs text-gray-500 h-12`}
            >
              <span className="hidden sm:inline">{column.label}</span>
              <span className="sm:hidden">{column.label.slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        {listHeight > 0 && (
          <List
            ref={listRef}
            height={listHeight}
            itemCount={itemCount}
            itemSize={ROW_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        )}
      </div>

      <div className="flex-shrink-0 p-2 bg-gray-50 border-t border-gray-300">
        <Typography
          variant="caption"
          className="text-gray-600 text-xs md:text-sm"
        >
          Showing {data.length} of {totalCount}{" "}
          {totalCount === 1 ? "item" : "items"}
          {isNextPageLoading && " (Loading...)"}
        </Typography>
      </div>
    </div>
  );
};

export const VirtualTable = memo(
  VirtualTableComponent
) as typeof VirtualTableComponent;
