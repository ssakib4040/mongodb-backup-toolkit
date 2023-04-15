import fse from "fs-extra";

declare class BackupToolkit {
  static backup(dbUri: string, backupPath: string): Promise<void>;
  static restore(dbUri: string, backupPath: fse.PathLike): Promise<void>;
}

export default BackupToolkit;
