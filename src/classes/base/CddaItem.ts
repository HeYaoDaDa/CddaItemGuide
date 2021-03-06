import { ColDef, ColGroupDef } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { BaseMod } from 'src/classes/base/BaseMod';
import { JsonItem } from 'src/classes/base/JsonItem';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { itemType2JsonType, jsonType2ItemType } from 'src/utils';
import { getArray, getOptionalString } from 'src/utils/json';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';
import { VNode } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { ViewableInterface } from './ViewableInterface';

export abstract class CddaItem<T extends object> implements ViewableInterface {
  finalized = false;
  isLoad = false;

  data: T = {} as T;

  // prepare
  json!: object;
  modId!: string;
  path!: string;
  jsonType!: string;
  type!: string;
  copyFromInfo?: {
    modIds: string[];
    jsonTypes: string[];
    id: string;
  };

  //outside set id
  id!: string;

  //only use in search
  refName!: string;
  description?: string;
  weight = 0;
  isSearch = false;

  //cache
  mod?: BaseMod;

  /**
   * init before add to indexer
   * @param jsonItem jsonItem
   */
  prepare(jsonItem: JsonItem) {
    this.json = jsonItem.json;
    this.modId = jsonItem.modId;
    this.path = jsonItem.path;
    this.jsonType = jsonItem.jsonType;
    this.type = jsonType2ItemType(this.jsonType);

    const copyFromId = getOptionalString(jsonItem.json, 'copy-from');

    if (copyFromId) {
      this.copyFromInfo = {
        modIds: [this.modId],
        jsonTypes: itemType2JsonType(this.type),
        id: copyFromId,
      };
    }
  }

  /**
   * init data from json, return is success
   */
  loadJson(): boolean {
    if (this.isLoad) return true;
    if (this.copyFromInfo) {
      this.copyFromInfo.modIds = this.getMod()
        .getDependencyMods()
        .map((v) => v.id);
      this.copyFromInfo.modIds.push(this.modId);

      const soure = cddaItemIndexer
        .findByModsByTypeAndId(this.copyFromInfo.modIds, this.type, this.copyFromInfo.id)
        .find((cddaItem) => cddaItem.isLoad);

      if (soure) {
        this.copyFromInfo = undefined;
        this.data = cloneDeep(soure.data) as T;
      } else {
        return false;
      }
    }

    this.doLoadJson(this.data, new CddaJsonParseUtil(this));
    this.isLoad = true;

    return true;
  }

  /**
   * last step, set Search Params
   */
  finalize() {
    if (this.finalized) return;
    // is lower
    this.doFinalize();
    this.resetSearch();
    this.finalized = true;
  }

  /**
   * reset search's refName and description
   */
  resetSearch() {
    const refName = this.doGetRefName();
    const name = this.doGetName();

    this.refName = refName ?? name ?? this.id;
    this.description = this.doGetDescription();
  }

  /**
   * get routeRaw
   */
  getRoute(): RouteLocationRaw {
    return {
      name: 'cddaItem',
      params: {
        type: this.type,
        id: this.id,
      },
    };
  }

  /**
   * get mod
   */
  getMod(): BaseMod {
    const configOptions = useConfigOptionsStore();
    if (!this.mod) this.mod = configOptions.findModById(this.modId);
    if (this.mod === undefined) throw new Error('no find mod why?');

    return this.mod;
  }

  /**
   * cddaItem name
   */

  getName(): string {
    return this.doGetName() ?? this.id;
  }

  /**
   * cddaItem name
   */

  getDescription(): string | undefined {
    this.description = this.doGetDescription();

    return this.description;
  }

  /**
   * cddaItem ref name, also use in search, read cache
   */
  getRefName(): string {
    this.refName = this.doGetRefName() ?? this.getName();

    return this.refName;
  }

  view(): VNode[] {
    const util = new ViewUtil();

    this.doView(this.data, util);

    return util.result;
  }

  //can over funcation

  /**
   * get cddaItem's id
   */
  parseId(): string[] {
    const jsonObject = this.json as Record<string, unknown>;
    const ids = getArray(jsonObject, 'id').map((id) => id as string);
    const abstractId = getArray(jsonObject, 'abstract').map((id) => id as string);

    return [...ids, ...abstractId];
  }

  /**
   * from json load data
   * @param data data
   * @param util jsonUtil
   */
  abstract doLoadJson(data: T, util: CddaJsonParseUtil): void;

  /**
   * after loadJson
   * can set weight and isSearch
   */
  doFinalize(): void {
    return;
  }

  /**
   * cddaItem name
   */
  abstract doGetName(): string | undefined;

  /**
   * cddaItem ref name, also use in search
   */
  doGetRefName(): string | undefined {
    return;
  }

  /**
   * update search param description
   * also use in myCard description
   */
  doGetDescription(): string | undefined {
    return;
  }

  abstract doView(data: T, util: ViewUtil): void;

  abstract gridColumnDefine(): (ColGroupDef | ColDef)[];
}
