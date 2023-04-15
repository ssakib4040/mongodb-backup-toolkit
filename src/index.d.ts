import mongoose from "mongoose";

/**
 * Backup the MongoDB database
 * @param dbUri The MongoDB URI
 * @param backupPath The path to backup the collections
 */
declare function backup(dbUri: string, backupPath: string): Promise<void>;

/**
 * Restore the MongoDB database
 * @param dbUri The MongoDB URI
 * @param backupPath The path of the backup collections
 */
declare function restore(dbUri: string, backupPath: string): Promise<void>;

export { backup, restore };
