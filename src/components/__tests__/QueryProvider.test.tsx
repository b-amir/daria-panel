import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useQuery } from "@tanstack/react-query";
import { QueryProvider } from "../QueryProvider";

const TestComponent = ({
  queryKey,
  queryFn,
}: {
  queryKey: string[];
  queryFn: () => Promise<string>;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  return <div>Data: {data}</div>;
};

describe("QueryProvider", () => {
  it("provides React Query functionality to child components", async () => {
    const mockQueryFn = jest.fn().mockResolvedValue("test data");

    render(
      <QueryProvider>
        <TestComponent queryKey={["test"]} queryFn={mockQueryFn} />
      </QueryProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Data: test data")).toBeInTheDocument();
    });

    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });

  it("handles query errors", async () => {
    const mockQueryFn = jest.fn().mockRejectedValue(new Error("Query failed"));

    render(
      <QueryProvider>
        <TestComponent queryKey={["test-error"]} queryFn={mockQueryFn} />
      </QueryProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Error: Query failed")).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  }, 15000);

  it("supports multiple queries simultaneously", async () => {
    const mockQueryFn1 = jest.fn().mockResolvedValue("data 1");
    const mockQueryFn2 = jest.fn().mockResolvedValue("data 2");

    render(
      <QueryProvider>
        <TestComponent queryKey={["multi-1"]} queryFn={mockQueryFn1} />
        <TestComponent queryKey={["multi-2"]} queryFn={mockQueryFn2} />
      </QueryProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Data: data 1")).toBeInTheDocument();
      expect(screen.getByText("Data: data 2")).toBeInTheDocument();
    });

    expect(mockQueryFn1).toHaveBeenCalledTimes(1);
    expect(mockQueryFn2).toHaveBeenCalledTimes(1);
  });
});
