import { cloneDeep, includes } from 'lodash';
import { logger } from './boot/logger';
import { jsonTypes } from './constants/jsonTypesConstant';
import { useUserConfigStore } from './stores/userConfig';
import { CddaItem } from './types/CddaItem';
import { JsonItem } from './types/JsonItem';
import { cddaItemFactory } from './types/RealCddaItemFactory';
import { arrayIsEmpty, convertToJsonType, popFilter } from './utils/commonUtil';

export class CddaItemIndexer {
  byModIdAndJsonTypeAndId: Map<string, Map<string, Map<string, CddaItem>>> = new Map();
  modinfos: CddaItem[] = [];
  deferred: Map<string, CddaItem[]> = new Map();
  searchs: CddaItem[] = [];

  findByTypeAndId(type: string, id: string): CddaItem[] {
    const userConfig = useUserConfigStore();
    return this.findByModsByTypeAndId(userConfig.modIds, type, id);
  }

  findByModsByTypeAndId(modIds: string[], type: string, id: string): CddaItem[] {
    const jsonTypes = convertToJsonType(type);
    const result = new Array<CddaItem>();
    modIds.forEach((modId) =>
      jsonTypes.forEach((fJsonType) => {
        const find = this.byModIdAndJsonTypeAndId.get(modId)?.get(fJsonType)?.get(id);
        if (find) result.push(find);
      })
    );
    return result;
  }

  clear() {
    this.byModIdAndJsonTypeAndId.clear();
    this.modinfos.length = 0;
    this.deferred.clear();
    this.searchs.length = 0;
  }

  addJsonItems(jsonItems: JsonItem[]) {
    jsonItems.forEach((jsonItem) => this.addJsonItem(jsonItem));
  }

  private addJsonItem(jsonItem: JsonItem) {
    const cddaItem = cddaItemFactory.generateCddaItem(jsonItem);
    this.addCddaItem(cddaItem);
  }

  private addCddaItem(cddaItem: CddaItem) {
    cddaItem.parseId().forEach((jsonId, index) => {
      if (index > 0) {
        const newCddaItem = cloneDeep(cddaItem);
        newCddaItem.id = jsonId;
        this.addCddaItemWithJsonId(newCddaItem);
      } else {
        cddaItem.id = jsonId;
        this.addCddaItemWithJsonId(cddaItem);
      }
    });
  }

  private addCddaItemWithJsonId(cddaItem: CddaItem) {
    if (!this.byModIdAndJsonTypeAndId.has(cddaItem.modId)) this.byModIdAndJsonTypeAndId.set(cddaItem.modId, new Map());
    const byJsonTypeById = this.byModIdAndJsonTypeAndId.get(cddaItem.modId) as Map<string, Map<string, CddaItem>>;
    if (!byJsonTypeById.has(cddaItem.jsonType)) byJsonTypeById.set(cddaItem.jsonType, new Map());
    const byId = byJsonTypeById.get(cddaItem.jsonType) as Map<string, CddaItem>;
    if (!byId.has(cddaItem.id)) byId.set(cddaItem.id, cddaItem);

    if (cddaItem.jsonType === jsonTypes.modInfo) this.modinfos.push(cddaItem);
  }

  processCopyFroms() {
    this.foreachALlCddaItem((cddaItem) => {
      this.processLoad(cddaItem);
    });
    logger.warn('deferred has ', this.deferred.size, this.deferred);
    logger.debug('processCopyFroms end');
  }

  finalizeAllCddaItem() {
    this.foreachALlCddaItem((cddaItem) => {
      cddaItem.finalize();
      if (cddaItem.doSearch()) this.searchs.push(cddaItem);
    });
    logger.debug('finalizeAllCddaItem end');
  }

  resetSearchs() {
    this.searchs.forEach((cddaItem) => cddaItem.doSearch());
  }

  private foreachALlCddaItem(fu: (cddaItem: CddaItem) => void) {
    this.byModIdAndJsonTypeAndId.forEach((byJsonTypeById) => byJsonTypeById.forEach((byId) => byId.forEach(fu)));
  }

  private processLoad(cddaItem: CddaItem) {
    if (cddaItem.load()) {
      this.addCddaItemWithJsonId(cddaItem);
      this.processSubInDeferred(cddaItem.modId, cddaItem.jsonType, cddaItem.id);
    } else {
      this.addDeferred(cddaItem);
    }
  }

  private addDeferred(cddaItem: CddaItem) {
    const info = cddaItem.copyFromInfo;
    if (info) {
      if (!this.deferred.has(info.id)) this.deferred.set(info.id, []);
      this.deferred.get(info.id)?.push(cddaItem);
    }
  }

  private processSubInDeferred(modId: string, jsonType: string, id: string) {
    const deferreds = this.deferred.get(id);
    if (deferreds) {
      popFilter(deferreds, (deferredItem) => {
        const info = deferredItem.copyFromInfo;
        if (info) {
          return includes(info.modIds, modId) && includes(info.jsonTypes, jsonType);
        } else {
          logger.error('why a no copyFromInfo cddaItem in deferred?', deferredItem);
          return false;
        }
      }).forEach((deferredItem) => this.processLoad(deferredItem));
      if (arrayIsEmpty(deferreds)) this.deferred.delete(id);
    }
  }
}

export const cddaItemIndexer = new CddaItemIndexer();
