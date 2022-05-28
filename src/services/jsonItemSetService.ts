import { logger } from 'src/boot/logger';
import { db } from 'src/db';
import { JsonItemSet } from 'src/types/db/JsonItemSet';

export async function saveJsonItemSet(jsonItemSet: JsonItemSet) {
  const result = await db.jsonItemSets.add(jsonItemSet);
  logger.debug('save JsonItemSet result is ', result);
}

export async function getJsonItemSetByVersionId(versionId: string) {
  const jsonItemSetsEntity = await db.jsonItemSets.get({ versionId });
  if (jsonItemSetsEntity) {
    return jsonItemSetsEntity;
  } else {
    return undefined;
  }
}
