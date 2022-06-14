import { myLogger } from 'src/boot/logger';
import { Version } from 'src/classes';
import { convertToVersion, convertToVersionEntity } from 'src/classes/db';
import { db } from 'src/db';

export async function saveVersion(version: Version) {
  const result = await db.versions.add(convertToVersionEntity(version));

  myLogger.debug('save version result is ', result);
}

export async function getVersionById(versionId: string) {
  const versionEntity = await db.versions.where('id').equals(versionId).first();

  if (versionEntity) {
    return convertToVersion(versionEntity);
  } else {
    return undefined;
  }
}

export async function hasVersionById(versionId: string) {
  return (await getVersionById(versionId)) != undefined;
}
