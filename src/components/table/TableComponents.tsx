import { Typography, CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { Column, getFlexClassFromWidth } from "@/constants/tableConfigs";
import { COMMON_STYLES } from "@/constants/commonStyles";

export const TableHeader = ({ title }: { title: string }) => {
  if (!title) return null;

  return (
    <div className="flex-shrink-0">
      <Typography
        variant="h6"
        className="px-4 py-8 pb-6 font-bold border-b border-gray-300 bg-gray-50 text-lg md:text-xl"
      >
        {title}
      </Typography>
    </div>
  );
};

export const TableColumnHeaders = ({ columns }: { columns: Column[] }) => (
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
);

export const TableFooter = ({
  dataLength,
  totalCount,
  isLoading,
}: {
  dataLength: number;
  totalCount: number;
  isLoading: boolean;
}) => (
  <div className="flex-shrink-0 p-2 bg-gray-50 border-t border-gray-300">
    <Typography variant="caption" className="text-gray-600 text-xs md:text-sm">
      Showing {dataLength} of {totalCount} {totalCount === 1 ? "item" : "items"}
      {isLoading && " (Loading...)"}
    </Typography>
  </div>
);

export const LoadMoreRow = ({
  style,
  isLoading,
  onLoadMore,
}: {
  style: React.CSSProperties;
  isLoading: boolean;
  onLoadMore: () => void;
}) => (
  <div
    style={style}
    className="flex items-center justify-center border-b border-gray-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
    onClick={onLoadMore}
  >
    <div className="flex items-center justify-center w-full h-full text-blue-600 hover:text-blue-700 font-medium">
      {isLoading ? (
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

export const DataRow = ({
  style,
  children,
}: {
  style: React.CSSProperties;
  children: ReactNode;
}) => (
  <div
    style={style}
    className="flex items-center border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
  >
    <div className="flex w-full items-center h-full">{children}</div>
  </div>
);
