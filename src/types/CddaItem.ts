import { cloneDeep } from 'lodash';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { convertToJsonType, convertToType } from 'src/utils/commonUtil';
import { getOptionalString } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { reactive } from 'vue';
import { JsonItem } from './JsonItem';

export abstract class CddaItem {
  finalize = false;
  isLoad = false;

  json!: object;
  path!: string;
  modId!: string;
  jsonType!: string;
  type!: string;
  id!: string;
  sreachParam?: {
    one: string;
    two: string;
  };
  copyFromInfo?: {
    modIds: string[];
    jsonTypes: string[];
    id: string;
  };
  data!: object;

  /**
   * validate is match JsonItem
   * @param jsonItem jsonItem object
   */
  abstract validate(jsonItem: JsonItem): boolean;

  loadJsonItem(jsonItem: JsonItem) {
    this.json = jsonItem.json;
    this.modId = jsonItem.modId;
    this.path = jsonItem.path;
    this.jsonType = jsonItem.jsonType;
    this.type = convertToType(this.jsonType);
    const copyFromId = getOptionalString(jsonItem.json, 'copy-from');
    if (copyFromId) {
      this.copyFromInfo = {
        modIds: [this.modId],
        jsonTypes: convertToJsonType(this.type),
        id: copyFromId,
      };
    }
  }

  load(): boolean {
    if (this.isLoad) return true;
    if (this.copyFromInfo) {
      const configOptions = useConfigOptionsStore();
      const currentMod = configOptions.findModById(this.modId);
      if (currentMod) {
        this.copyFromInfo.modIds = [this.modId, ...currentMod.dependencies];
        const soure = cddaItemIndexer
          .findByModsByTypeAndId(this.copyFromInfo.modIds, this.type, this.copyFromInfo.id)
          .find((cddaItem) => cddaItem.isLoad);
        if (soure) {
          this.copyFromInfo = undefined;
          this.data = reactive(cloneDeep(soure.data));
        } else {
          return false;
        }
      } else {
        logger.error('no find current mod ', this.modId);
      }
    }
    this.parseJson(this.data, new JsonParseUtil(this));
    this.isLoad = true;
    return true;
  }

  abstract parseJson(data: object, util: JsonParseUtil): void;

  abstract parseId(): string[];
}
