# Mongodb Backup Toolkit

This Node.js library that allows you to easily backup and restore MongoDB databases using Mongoose and the filesystem module. The backup function writes all collections to individual JSON files in a specified directory, while the restore function reads the JSON files and inserts them into the specified database.

## Installation

```bash
npm install mongodb-backup-toolkit
```

or maybe yarn

```bash
yarn add mongodb-backup-toolkit
```

## Usage

```javascript
const backup = require("mongodb-backup-toolkit");

// Backup
backup.backup("mongodb://localhost:27017/database", "backup", function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Backup complete!");
  }
});

// Restore
backup.restore("mongodb://localhost:27017/database", "backup", function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("Restore complete!");
  }
});
```

<!-- API in table -->

## API

| Function | Description                                           |
| -------- | ----------------------------------------------------- |
| backup   | Backup a MongoDB database to a specified directory    |
| restore  | Restore a MongoDB database from a specified directory |

## License

[MIT](https://choosealicense.com/licenses/mit/)
