# Mongodb Backup Toolkit

This Node.js library that allows you to easily backup and restore MongoDB databases using Mongoose and the filesystem module. The backup function writes all collections to individual JSON files in a specified directory, while the restore function reads the JSON files and inserts them into the specified database.

## Installation

```bash
npm install mongodb-backup-toolkit
```

or yarn

```bash
yarn add mongodb-backup-toolkit
```

## Usage

```javascript
import MongoBackupToolkit from "mongodb-backup-toolkit";

// Backup
await MongoBackupToolkit.backup(
  "mongodb://localhost:27017/mydatabase",
  "backup"
);

// Restore
await MongoBackupToolkit.restore(
  "mongodb://localhost:27017/mydatabase",
  "backup"
);
```

Pro Tip:

If you're using Nodemon to run your application, make sure to ignore the backup folder created by the BackupToolkit. You can add the backup folder to the nodemon ignore list in your nodemon.json or nodemon.config.js file:

```json
{
  "ignore": ["backup"]
}
```

<!-- API in table -->

## API

| Function | Description                                           |
| -------- | ----------------------------------------------------- |
| backup   | Backup a MongoDB database to a specified directory    |
| restore  | Restore a MongoDB database from a specified directory |

## License

[MIT](https://choosealicense.com/licenses/mit/)
