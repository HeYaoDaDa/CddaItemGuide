import { logger } from 'src/boot/logger';
import { db } from 'src/db';
import { convertToJsonItem, convertToJsonItemEnrity, JsonItemSet } from 'src/types/db/JsonItemSet';

export async function saveJsonItemSet(jsonItemSet: JsonItemSet) {
  const result = await db.jsonItemSets.add(convertToJsonItemEnrity(jsonItemSet));
  logger.debug('save JsonItemSet result is ', result);
}

export async function getJsonItemSetByVersionId(versionId: string) {
  const jsonItemSetsEntity = await db.jsonItemSets.where('versionId').equals(versionId).first();
  if (jsonItemSetsEntity) {
    return convertToJsonItem(jsonItemSetsEntity);
  } else {
    return undefined;
  }
}
