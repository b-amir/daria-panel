import { LogType } from "@/types/logs";
import { apiPost } from "@/utils/api";
import { promises as fs } from "fs";
import path from "path";

jest.mock("@/utils/api");
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockProcessCwd = jest
  .spyOn(process, "cwd")
  .mockReturnValue("/mock/project");
jest.mock("path", () => ({
  join: jest.fn().mockReturnValue("/mock/project/mockDB/logs.json"),
}));

import { addLogViaApi, writeLogToFile } from "../logs.service";

const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
const mockPathJoin = path.join as jest.MockedFunction<typeof path.join>;

describe("logs.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProcessCwd.mockReturnValue("/mock/project");
    mockPathJoin.mockReturnValue("/mock/project/mockDB/logs.json");
  });

  afterAll(() => {
    mockProcessCwd.mockRestore();
  });

  describe("addLogViaApi", () => {
    it("calls API with correct log data", async () => {
      mockApiPost.mockResolvedValue(undefined);

      await addLogViaApi(
        "testuser",
        "login_attempt",
        LogType.LOGIN,
        "successful login"
      );

      expect(mockApiPost).toHaveBeenCalledWith("/api/logs", {
        user: "testuser",
        event: "login_attempt",
        type: LogType.LOGIN,
        details: "successful login",
      });
    });

    it("handles API failures gracefully", async () => {
      mockApiPost.mockRejectedValue(new Error("Network error"));

      await expect(
        addLogViaApi("testuser", "login_attempt", LogType.LOGIN)
      ).rejects.toThrow("Network error");
    });
  });

  describe("writeLogToFile", () => {
    const existingLogs = [
      {
        id: 1,
        user: "user1",
        event: "previous_login",
        type: LogType.LOGIN,
        time: "2024-01-01T10:00:00.000Z",
      },
    ];

    beforeEach(() => {
      mockReadFile.mockResolvedValue(JSON.stringify(existingLogs));
      mockWriteFile.mockResolvedValue();
    });

    it("appends new log entry with correct data and auto-generated ID", async () => {
      const fixedDate = new Date("2024-01-01T10:30:00.000Z");
      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(fixedDate.toISOString());

      await writeLogToFile(
        "testuser",
        "user_action",
        LogType.LOGIN,
        "test details"
      );

      const writeCall = mockWriteFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall?.[1] as string);

      expect(writtenData).toHaveLength(2);
      expect(writtenData[1]).toMatchObject({
        id: 2,
        user: "testuser",
        event: "user_action",
        type: LogType.LOGIN,
        details: "test details",
        time: fixedDate.toISOString(),
      });
    });

    it("creates first log entry when file is empty", async () => {
      mockReadFile.mockResolvedValue("[]");

      await writeLogToFile("testuser", "first_action", LogType.LOGIN);

      const writeCall = mockWriteFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall?.[1] as string);

      expect(writtenData).toHaveLength(1);
      expect(writtenData[0]).toMatchObject({
        id: 1,
        user: "testuser",
        event: "first_action",
        type: LogType.LOGIN,
      });
    });

    it("throws descriptive error when file operations fail", async () => {
      mockWriteFile.mockRejectedValue(new Error("Disk full"));

      await expect(
        writeLogToFile("testuser", "test_event", LogType.LOGIN)
      ).rejects.toThrow("Failed to add log entry");
    });
  });
});
