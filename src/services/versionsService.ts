import { logger } from 'src/boot/logger';
import { db } from 'src/db';
import { convertToVersion, convertToVersionEntity } from 'src/types/db/VersionEntity';
import { Version } from 'src/types/Version';

export async function saveVersion(version: Version) {
  const result = await db.versions.add(convertToVersionEntity(version));
  logger.debug('save version result is ', result);
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
