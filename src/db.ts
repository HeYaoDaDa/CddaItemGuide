import Dexie from 'dexie';
import { logger } from './boot/logger';
import { JsonItemSet } from './types/db/JsonItemSet';
import { PoFile } from './types/db/PoFile';
import { VersionEntity } from './types/db/VersionEntity';

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
db.open().catch((e) => logger.error('open fail', e));
