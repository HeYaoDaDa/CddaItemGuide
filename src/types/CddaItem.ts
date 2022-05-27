import { ColDef, ColGroupDef } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { convertToJsonType, convertToType } from 'src/utils/commonUtil';
import { getOptionalString } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { VNode } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { JsonItem } from './JsonItem';

export abstract class CddaItem {
  finalized = false;
  isLoad = false;

  json!: object;
  path!: string;
  modId!: string;
  jsonType!: string;
  type!: string;
  id!: string;
  name!: string;
  description?: string;
  weight = 0;
  isSearch = false;
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
          this.data = cloneDeep(soure.data);
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

  finalize() {
    if (this.finalized) return;
    this.doFinalize();
    this.prepareSearch();
    this.finalized = true;
  }

  getRoute(): RouteLocationRaw {
    return {
      name: 'cddaItem',
      params: {
        type: this.type,
        id: this.id,
      },
    };
  }

  view(): VNode[] {
    const util = new ViewUtil();
    this.doView(this.data, util);
    return util.result;
  }

  abstract parseId(): string[];

  abstract parseJson(data: object, util: JsonParseUtil): void;

  abstract doFinalize(): void;

  abstract prepareSearch(): void;

  abstract doView(data: object, util: ViewUtil): void;

  abstract gridColumnDefine(): (ColGroupDef | ColDef)[];
}
