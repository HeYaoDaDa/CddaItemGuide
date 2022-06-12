import Dexie from 'dexie';
import { myLogger } from './boot/logger';
import { JsonItemSet, PoFile, VersionEntity } from 'src/classes/db';

class CddaGameData extends Dexie {
  jsonItemSets!: Dexie.Table<JsonItemSet, string>;
  poFiles!: Dexie.Table<PoFile, string>;
  versions!: Dexie.Table<VersionEntity, string>;

  constructor() {
    super('CddaGameData');
    this.version(1).stores({
      jsonItemSets: 'versionId',
      poFiles: '[versionId+languageCode]',
      versions: 'id, publishDate',
    });
  }
}

export const db = new CddaGameData();
db.open().catch((e) => myLogger.error('open fail', e));
