import { myLogger } from 'src/boot/logger';
import { db } from 'src/db';
import { JsonItemSet } from 'src/classes/db';

export async function saveJsonItemSet(jsonItemSet: JsonItemSet) {
  const result = await db.jsonItemSets.add(jsonItemSet);

  myLogger.debug('save JsonItemSet result is ', result);
}

export async function getJsonItemSetByVersionId(versionId: string) {
  const jsonItemSetsEntity = await db.jsonItemSets.get({ versionId });

  if (jsonItemSetsEntity) {
    return jsonItemSetsEntity;
  } else {
    return undefined;
  }
}
