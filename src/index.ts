import mongoose from "mongoose";
import Listr from "listr";
import { promises as fs } from "fs";
import fse from "fs-extra";

class BackupToolkit {
  static async backup(dbUri: string, backupPath: string) {
    await fse.ensureDir(backupPath);

    const tasks = new Listr([
      {
        title: "Connecting to database",
        task: async () => await mongoose.connect(dbUri),
      },
      {
        title: "Backing up collections",
        task: async (ctx, task) => {
          const collections = await mongoose.connection.db.collections();
          const collectionTasks = collections.map((collection) => ({
            title: `Backing up ${collection.collectionName}`,
            task: async () => {
              const docs = await collection.find().toArray();
              const filename = `${backupPath}/${collection.collectionName}.json`;
              await fs.writeFile(filename, JSON.stringify(docs));
            },
          }));
          return new Listr(collectionTasks, { concurrent: true });
        },
      },
      {
        title: "Backup completed",
        task: () => console.log("Backup completed ✔"),
      },
    ]);

    await tasks.run();
    mongoose.connection.close();
  }

  static async restore(dbUri: string, backupPath: fse.PathLike) {
    if (!(await BackupToolkit.isDirectoryExists(backupPath))) {
      console.log("Error: Backup folder doesn't exist");
      return;
    }

    const tasks = new Listr([
      {
        title: "Connecting to database",
        task: async () => await mongoose.connect(dbUri),
      },
      {
        title: "Restoring collections",
        task: async (ctx, task) => {
          const filenames = await fs.readdir(backupPath);
          const collectionTasks = filenames.map((filename) => ({
            title: `Restoring ${filename}`,
            task: async () => {
              const collectionName = filename.slice(0, -5);
              const collection =
                mongoose.connection.db.collection(collectionName);
              const data = await fs.readFile(
                `${backupPath}/${filename}`,
                "utf8"
              );
              const docs = JSON.parse(data);
              await collection.deleteMany({});
              await collection.insertMany(docs);
            },
          }));
          return new Listr(collectionTasks, { concurrent: true });
        },
      },
      {
        title: "Restore completed",
        task: () => console.log("Restore completed"),
      },
    ]);

    await tasks.run();
    mongoose.connection.close();
  }

  static async isDirectoryExists(path: fse.PathLike) {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return false;
      } else {
        throw error;
      }
    }
  }
}

export default BackupToolkit;
