/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { LogType } from "@/types/logs";
import {
  writeLogToFile,
  readPaginatedLogsFromFile,
  getLogsCountFromFile,
} from "@/services/logs.service";

jest.mock("@/services/logs.service");
const mockWriteLogToFile = writeLogToFile as jest.MockedFunction<
  typeof writeLogToFile
>;
const mockReadPaginatedLogsFromFile =
  readPaginatedLogsFromFile as jest.MockedFunction<
    typeof readPaginatedLogsFromFile
  >;
const mockGetLogsCountFromFile = getLogsCountFromFile as jest.MockedFunction<
  typeof getLogsCountFromFile
>;

describe("/api/logs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/logs", () => {
    it("creates log entry with valid data", async () => {
      mockWriteLogToFile.mockResolvedValue();

      const request = new NextRequest("http://localhost/api/logs", {
        method: "POST",
        body: JSON.stringify({
          user: "testuser",
          event: "login_attempt",
          type: LogType.LOGIN,
          details: "Successful login",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockWriteLogToFile).toHaveBeenCalledWith(
        "testuser",
        "login_attempt",
        LogType.LOGIN,
        "Successful login"
      );
    });

    it("creates log entry without optional details", async () => {
      mockWriteLogToFile.mockResolvedValue();

      const request = new NextRequest("http://localhost/api/logs", {
        method: "POST",
        body: JSON.stringify({
          user: "testuser",
          event: "logout",
          type: LogType.LOGOUT,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockWriteLogToFile).toHaveBeenCalledWith(
        "testuser",
        "logout",
        LogType.LOGOUT,
        undefined
      );
    });

    it("returns 400 for missing required fields", async () => {
      const testCases = [
        { body: { event: "test", type: LogType.LOGIN }, missing: "user" },
        { body: { user: "test", type: LogType.LOGIN }, missing: "event" },
        { body: { user: "test", event: "test" }, missing: "type" },
      ];

      for (const testCase of testCases) {
        const request = new NextRequest("http://localhost/api/logs", {
          method: "POST",
          body: JSON.stringify(testCase.body),
          headers: { "Content-Type": "application/json" },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: "User, event, and type are required" });
        expect(mockWriteLogToFile).not.toHaveBeenCalled();
      }
    });

    it("returns 500 when log creation fails", async () => {
      mockWriteLogToFile.mockRejectedValue(new Error("Storage error"));

      const request = new NextRequest("http://localhost/api/logs", {
        method: "POST",
        body: JSON.stringify({
          user: "testuser",
          event: "test_event",
          type: LogType.LOGIN,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to add log" });
    });
  });

  describe("GET /api/logs", () => {
    const mockLogs = [
      {
        id: 1,
        user: "user1",
        event: "login",
        type: LogType.LOGIN,
        time: "2024-01-01T10:00:00.000Z",
      },
      {
        id: 2,
        user: "user2",
        event: "logout",
        type: LogType.LOGOUT,
        time: "2024-01-01T10:01:00.000Z",
      },
      {
        id: 3,
        user: "user3",
        event: "page_visit: dashboard",
        type: LogType.PAGE_VISIT,
        time: "2024-01-01T10:02:00.000Z",
      },
    ];

    it("returns logs with default pagination", async () => {
      const reversedLogs = [...mockLogs].reverse();
      mockReadPaginatedLogsFromFile.mockResolvedValue(reversedLogs);
      mockGetLogsCountFromFile.mockResolvedValue(3);

      const request = new NextRequest("http://localhost/api/logs");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        logs: reversedLogs,
        total: 3,
        limit: 20,
        offset: 0,
        hasMore: false,
      });
      expect(mockReadPaginatedLogsFromFile).toHaveBeenCalledWith(20, 0);
    });

    it("handles custom pagination parameters", async () => {
      const paginatedLogs = [mockLogs[1], mockLogs[0]];
      mockReadPaginatedLogsFromFile.mockResolvedValue(paginatedLogs);
      mockGetLogsCountFromFile.mockResolvedValue(5);

      const request = new NextRequest(
        "http://localhost/api/logs?limit=2&offset=1"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limit).toBe(2);
      expect(data.offset).toBe(1);
      expect(data.total).toBe(5);
      expect(data.hasMore).toBe(true);
      expect(mockReadPaginatedLogsFromFile).toHaveBeenCalledWith(2, 1);
    });

    it("handles edge cases and invalid parameters gracefully", async () => {
      const reversedLogs = [...mockLogs].reverse();
      mockReadPaginatedLogsFromFile.mockResolvedValue(reversedLogs);
      mockGetLogsCountFromFile.mockResolvedValue(3);

      const testCases = [
        { query: "?limit=invalid", expectedLimit: 20, expectedOffset: 0 },
        { query: "?offset=invalid", expectedLimit: 20, expectedOffset: 0 },
        { query: "?limit=150", expectedLimit: 100, expectedOffset: 0 },
        { query: "", expectedLimit: 20, expectedOffset: 0 },
      ];

      for (const testCase of testCases) {
        mockReadPaginatedLogsFromFile.mockClear();

        const request = new NextRequest(
          `http://localhost/api/logs${testCase.query}`
        );
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.limit).toBe(testCase.expectedLimit);
        expect(data.offset).toBe(testCase.expectedOffset);
        expect(mockReadPaginatedLogsFromFile).toHaveBeenCalledWith(
          testCase.expectedLimit,
          testCase.expectedOffset
        );
      }
    });

    it("returns 500 when log retrieval fails", async () => {
      mockReadPaginatedLogsFromFile.mockRejectedValue(
        new Error("Storage error")
      );
      mockGetLogsCountFromFile.mockRejectedValue(new Error("Storage error"));

      const request = new NextRequest("http://localhost/api/logs");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch logs" });
    });
  });
});
