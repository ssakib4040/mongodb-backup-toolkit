"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
let client;
function backup(url, dbName, backupDir) {
    return __awaiter(this, void 0, void 0, function* () {
        client = new mongodb_1.MongoClient(url);
        try {
            yield client.connect();
            console.log("Connected to database");
            const db = client.db(dbName);
            const collections = yield db.listCollections().toArray();
            const ora = yield Promise.resolve().then(() => __importStar(require("ora")));
            const spinner = ora.default("Backing up database").start();
            for (const collection of collections) {
                const data = yield db.collection(collection.name).find().toArray();
                const backupFile = `${backupDir}/${collection.name}.json`;
                fs_1.default.writeFileSync(backupFile, JSON.stringify(data, null, 2));
                spinner.text = `Backing up ${collection.name} collection`;
            }
            spinner.succeed("Backup complete");
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield client.close();
            console.log("Disconnected from database");
        }
    });
}
function restore(url, dbName, backupDir) {
    return __awaiter(this, void 0, void 0, function* () {
        client = new mongodb_1.MongoClient(url);
        try {
            yield client.connect();
            console.log("Connected to database");
            const db = client.db(dbName);
            const backupFiles = fs_1.default.readdirSync(backupDir);
            const ora = yield Promise.resolve().then(() => __importStar(require("ora")));
            const spinner = ora.default("Restoring database").start();
            for (const backupFile of backupFiles) {
                if (backupFile.endsWith(".json")) {
                    const collectionName = backupFile.slice(0, -5);
                    const data = JSON.parse(fs_1.default.readFileSync(`${backupDir}/${backupFile}`, "utf-8"));
                    yield db.createCollection(collectionName);
                    yield db.collection(collectionName).deleteMany({});
                    yield db.collection(collectionName).insertMany(data);
                    spinner.text = `Restored ${collectionName} collection`;
                }
            }
            spinner.succeed("Database restore complete");
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield client.close();
            console.log("Disconnected from database");
        }
    });
}
module.exports = {
    backup,
    restore,
};
