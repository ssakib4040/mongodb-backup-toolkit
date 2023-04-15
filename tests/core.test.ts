import fs from "fs";
import { expect } from "chai";
import { backup, restore, isDirectoryExists } from "../src/index";

describe("mongodb-backup-toolkit", () => {
  const backupPath = "tests/backup";

  before(async () => {
    // Connect to database before running tests
    const dbUri = "mongodb://127.0.0.1:27017/test";
    await backup(dbUri, backupPath);
  });

  after(async () => {
    // Restore the database after running tests
    const dbUri = "mongodb://127.0.0.1:27017/test";
    await restore(dbUri, backupPath);

    fs.rmdirSync(backupPath, { recursive: true });
  });

  describe("#backup()", () => {
    it("should create a backup of the database", async () => {
      const dbUri = "mongodb://127.0.0.1:27017/test";
      await backup(dbUri, backupPath);
      // Check if backup directory exists
      const directoryCheck: any = await isDirectoryExists(backupPath);
      expect(directoryCheck).to.be.true;
    });
  });

  describe("#restore()", () => {
    it("should restore the database from a backup", async () => {
      const dbUri = "mongodb://127.0.0.1:27017/test";
      await restore(dbUri, backupPath);
      // Check if database was restored successfully
    });
  });
});
