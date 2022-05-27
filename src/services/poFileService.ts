import { Loading } from 'quasar';
import { getPoFileByVersionAndLanguageCode } from 'src/apis/poFileApi';
import { i18n } from 'src/boot/i18n';
import { logger } from 'src/boot/logger';
import { LANGUAGE_OPTIONS } from 'src/constants/appConstant';
import { db } from 'src/db';
import { gettext } from 'src/gettext';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
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

export async function initGettext() {
  const loadLock = !Loading.isActive;
  if (loadLock) Loading.show({ message: i18n.global.t('message.i18n') });
  const start = performance.now();
  logger.debug('start init gettext');
  const userConfig = useUserConfigStore();
  const configOptions = useConfigOptionsStore();
  if (userConfig.languageCode === LANGUAGE_OPTIONS[0].value) {
    logger.debug(`language code is ${userConfig.languageCode}, no need use gettext.`);
    gettext.clear();
    if (loadLock) Loading.hide();
    return;
  }
  let poStr = (await getSavePoFileByVersion(userConfig.versionId, userConfig.languageCode))?.po;
  if (poStr) {
    logger.debug('db has po ', userConfig.languageCode);
  } else {
    logger.debug('db no has po ', userConfig.languageCode);
    const version = configOptions.findVersionById(userConfig.versionId);
    if (version) {
      poStr = await getPoFileByVersionAndLanguageCode(version);
      await savePoFile({ versionId: userConfig.versionId, languageCode: userConfig.languageCode, po: poStr });
    } else {
      logger.error(`new version ${userConfig.versionId} is no find in config Options, Why?`);
    }
  }
  gettext.changeGettext(poStr as string);
  const end = performance.now();
  logger.debug(`init gettext success, cost time is ${end - start}ms, language is ${userConfig.languageCode}`);
  if (loadLock) Loading.hide();
}
