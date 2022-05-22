import { logger } from 'src/boot/logger';
import { db } from 'src/db';
import { PoFile } from 'src/types/db/PoFile';

export async function savePoFile(poFile: PoFile) {
  const result = await db.poFiles.add(poFile);
  logger.debug('save poFile result is ', result);
}

export async function getSavePoFileByVersion(versionId: string, languageCode: string) {
  return await db.poFiles.get({ versionId, languageCode });
}

export async function hasPoFileByVersionIdAndLanguageCode(versionId: string, languageCode: string) {
  return (await getSavePoFileByVersion(versionId, languageCode)) != undefined;
}
