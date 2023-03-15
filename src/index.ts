import fs from "fs";
import { MongoClient } from "mongodb";

let client;

async function backup(url: string, dbName: string, backupDir: string) {
  client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to database");

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const ora = await import("ora");
    const spinner = ora.default("Backing up database").start();

    for (const collection of collections) {
      const data = await db.collection(collection.name).find().toArray();
      const backupFile = `${backupDir}/${collection.name}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
      spinner.text = `Backing up ${collection.name} collection`;
    }

    spinner.succeed("Backup complete");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Disconnected from database");
  }
}

async function restore(url: string, dbName: string, backupDir: string) {
  client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to database");

    const db = client.db(dbName);
    const backupFiles = fs.readdirSync(backupDir);

    const ora = await import("ora");
    const spinner = ora.default("Restoring database").start();

    for (const backupFile of backupFiles) {
      if (backupFile.endsWith(".json")) {
        const collectionName = backupFile.slice(0, -5);
        const data = JSON.parse(
          fs.readFileSync(`${backupDir}/${backupFile}`, "utf-8")
        );

        await db.createCollection(collectionName);
        await db.collection(collectionName).deleteMany({});
        await db.collection(collectionName).insertMany(data);

        spinner.text = `Restored ${collectionName} collection`;
      }
    }

    spinner.succeed("Database restore complete");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Disconnected from database");
  }
}

module.exports = {
  backup,
  restore,
};
