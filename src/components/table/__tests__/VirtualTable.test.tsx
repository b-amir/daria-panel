import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { VirtualTable } from "../VirtualTable";
import { LogEntry, LogType } from "@/types/logs";
import { LOGS_TABLE_COLUMNS } from "@/constants/tableConfigs";

jest.mock("react-window", () => ({
  FixedSizeList: ({
    children,
    itemCount,
    itemSize,
  }: {
    children: (props: {
      index: number;
      style: React.CSSProperties;
    }) => React.ReactNode;
    itemCount: number;
    itemSize: number;
  }) => (
    <div
      data-testid="virtual-list"
      data-item-count={itemCount}
      data-item-size={itemSize}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <div key={index}>
          {children({ index, style: { height: itemSize } })}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../hooks/useListHeight", () => ({
  useListHeight: () => 400,
}));

const mockLogs: LogEntry[] = [
  {
    id: 1,
    user: "user1",
    event: "login",
    type: LogType.LOGIN,
    time: "2024-01-01T10:00:00.000Z",
    details: "Successful login",
  },
  {
    id: 2,
    user: "user2",
    event: "page_visit: dashboard",
    type: LogType.PAGE_VISIT,
    time: "2024-01-01T10:01:00.000Z",
    details: "Visited dashboard",
  },
];

const mockRenderRow = (log: LogEntry) => (
  <div data-testid={`log-row-${log.id}`}>{log.event}</div>
);

const defaultProps = {
  title: "Test Logs",
  columns: LOGS_TABLE_COLUMNS,
  data: mockLogs,
  renderRow: mockRenderRow,
  hasNextPage: false,
  isNextPageLoading: false,
  loadNextPage: jest.fn(),
  totalCount: 2,
};

describe("VirtualTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with data and headers", () => {
    render(<VirtualTable {...defaultProps} />);

    expect(screen.getByText("Test Logs")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByTestId("log-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("log-row-2")).toBeInTheDocument();
    expect(screen.getByText(/Showing 2 of 2 items/)).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
    render(<VirtualTable {...defaultProps} data={[]} totalCount={0} />);

    expect(screen.getByText(/Showing 0 of 0 items/)).toBeInTheDocument();
  });

  it("handles pagination when more data is available", async () => {
    const mockLoadNextPage = jest.fn().mockResolvedValue(undefined);

    render(
      <VirtualTable
        {...defaultProps}
        hasNextPage={true}
        loadNextPage={mockLoadNextPage}
      />
    );

    expect(screen.getByText("Load More")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Load More"));
    expect(mockLoadNextPage).toHaveBeenCalledTimes(1);
  });

  it("shows loading state during pagination", () => {
    render(
      <VirtualTable
        {...defaultProps}
        hasNextPage={true}
        isNextPageLoading={true}
      />
    );

    expect(screen.getByText("Loading more")).toBeInTheDocument();
    expect(screen.queryByText("Load More")).not.toBeInTheDocument();
  });

  it("handles large datasets efficiently", () => {
    const largeMockData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      user: `user${i}`,
      event: `event${i}`,
      type: LogType.LOGIN,
      time: "2024-01-01T10:00:00.000Z",
    }));

    render(
      <VirtualTable {...defaultProps} data={largeMockData} totalCount={1000} />
    );

    const virtualList = screen.getByTestId("virtual-list");
    expect(virtualList).toHaveAttribute("data-item-count", "1000");
    expect(screen.getByText(/Showing 1000 of 1000 items/)).toBeInTheDocument();
  });
});
