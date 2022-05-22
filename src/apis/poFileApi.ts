import { api } from 'src/boot/axios';
import { logger } from 'src/boot/logger';
import { useUserConfigStore } from 'src/stores/userConfig';
import { Version } from 'src/types/Version';
import { unzip } from 'src/utils/zipUtil';

export async function getPoFileByVersionAndLanguageCode(version: Version, languageCode?: string) {
  const myLanguageCode = languageCode ?? useUserConfigStore().languageCode;
  //TODO:the jsonUrls should to process
  const url = version.languages.find((language) => language.code === myLanguageCode)?.urls[0];
  console.log('po url', url, version.languages);
  if (url) {
    const response = await api.get(url, { responseType: 'arraybuffer', decompress: false });
    return unzip(response.data);
  }
  logger.error('no find language url, code is ', myLanguageCode);
  return '';
}
