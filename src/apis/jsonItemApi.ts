import { api } from 'src/boot/axios';
import { JsonItem } from 'src/classes/base/JsonItem';
import { Version } from 'src/classes/base/Version';
import { unzip } from 'src/utils';

export async function getAllJsonItems(version: Version): Promise<JsonItem[]> {
  //TODO:the jsonUrls should to process
  const response = await api.get(version.jsonUrls[0], { responseType: 'arraybuffer', decompress: false });
  const newLocal = unzip(response.data);

  return JSON.parse(newLocal);
}
