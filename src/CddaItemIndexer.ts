import { cloneDeep, includes } from 'lodash';
import { Loading } from 'quasar';
import { ref } from 'vue';
import { getAllJsonItems } from './apis/jsonItemApi';
import { i18n } from './boot/i18n';
import { logger } from './boot/logger';
import { jsonTypes } from './constants/jsonTypesConstant';
import { getJsonItemSetByVersionId, saveJsonItemSet } from './services/jsonItemSetService';
import { hasVersionById, saveVersion } from './services/versionsService';
import { useConfigOptionsStore } from './stores/configOptions';
import { useUserConfigStore } from './stores/userConfig';
import { CddaItem } from './types/CddaItem';
import { JsonItem } from './types/JsonItem';
import { cddaItemFactory } from './types/RealCddaItemFactory';
import { arrayIsEmpty, convertToJsonType, popFilter, replaceArray } from './utils/commonUtil';

export class CddaItemIndexer {
  byModIdAndJsonTypeAndId: Map<string, Map<string, Map<string, CddaItem>>> = new Map();
  byModIdAndJsonType: Map<string, Map<string, CddaItem[]>> = new Map();
  modinfos: CddaItem[] = [];
  deferred: Map<string, CddaItem[]> = new Map();
  searchs: CddaItem[] = [];
  finalized = ref(false);

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

  findByType(type: string): CddaItem[] {
    const userConfig = useUserConfigStore();
    return this.findByModsByType(userConfig.modIds, type);
  }

  findByModsByType(modIds: string[], type: string): CddaItem[] {
    const jsonTypes = convertToJsonType(type);
    const result = new Array<CddaItem>();
    modIds.forEach((modId) =>
      jsonTypes.forEach((fJsonType) => {
        const find = this.byModIdAndJsonType.get(modId)?.get(fJsonType);
        if (find) result.push(...find);
      })
    );
    return result;
  }

  clear() {
    this.byModIdAndJsonTypeAndId.clear();
    this.byModIdAndJsonType.clear();
    this.modinfos.length = 0;
    this.deferred.clear();
    this.searchs.length = 0;
  }

  async init() {
    const loadLock = !Loading.isActive;
    if (loadLock) Loading.show({ message: i18n.global.t('message.gameData') });
    const start = performance.now();
    logger.debug('start init CddaItemIndexer');
    const configOptions = useConfigOptionsStore();
    const jsonItems = await this.getJsonItems();
    this.clear();
    this.addJsonItems(jsonItems);
    configOptions.updateMods();
    this.processCopyFroms();
    this.finalizeAllCddaItem();
    this.finalized.value = true;
    const end = performance.now();
    logger.debug(
      `init CddaItemIndexer success, cost time is ${end - start}ms, input jsonItem size is ${jsonItems.length}`
    );
    if (loadLock) Loading.hide();
  }

  private async getJsonItems() {
    const start = performance.now();
    const userConfig = useUserConfigStore();
    const configOptions = useConfigOptionsStore();
    const jsonItems = [] as JsonItem[];
    if (await hasVersionById(userConfig.versionId)) {
      logger.debug(`version id ${userConfig.versionId} is has in db.`);
      const dbJsonItemSet = await getJsonItemSetByVersionId(userConfig.versionId);
      if (dbJsonItemSet) {
        replaceArray(jsonItems, dbJsonItemSet.jsonItems);
      }
    } else {
      const newVersion = configOptions.findVersionById(userConfig.versionId);
      logger.debug(`version id ${userConfig.versionId} is no in db. start save`);
      if (newVersion) {
        const remoteJsonItems = await getAllJsonItems(newVersion);
        await saveJsonItemSet({ versionId: userConfig.versionId, jsonItems: remoteJsonItems });
        await saveVersion(newVersion);
        replaceArray(jsonItems, remoteJsonItems);
      } else {
        logger.error(`new version ${userConfig.versionId} is no find in config Options, Why?`);
      }
    }
    const end = performance.now();
    logger.debug(`cddaItemIndexer getJsonItems cost time is ${end - start}ms`);
    return jsonItems;
  }

  private addJsonItems(jsonItems: JsonItem[]) {
    const start = performance.now();
    jsonItems.forEach((jsonItem) => this.addJsonItem(jsonItem));
    const end = performance.now();
    logger.debug(`cddaItemIndexer prepare cost time is ${end - start}ms`);
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
    byJsonTypeById.get(cddaItem.jsonType)?.set(cddaItem.id, cddaItem);

    if (!this.byModIdAndJsonType.has(cddaItem.modId)) this.byModIdAndJsonType.set(cddaItem.modId, new Map());
    const byJsonType = this.byModIdAndJsonType.get(cddaItem.modId) as Map<string, CddaItem[]>;
    if (!byJsonType.has(cddaItem.jsonType)) byJsonType.set(cddaItem.jsonType, []);
    byJsonType.get(cddaItem.jsonType)?.push(cddaItem);

    if (cddaItem.jsonType === jsonTypes.modInfo) this.modinfos.push(cddaItem);
  }

  private processCopyFroms() {
    const start = performance.now();
    this.foreachAllCddaItem((cddaItem) => {
      this.processLoad(cddaItem);
    });
    logger.warn('deferred has ', this.deferred.size, this.deferred);
    logger.debug('processCopyFroms end');
    const end = performance.now();
    logger.debug(`cddaItemIndexer load cost time is ${end - start}ms`);
  }

  private finalizeAllCddaItem() {
    const start = performance.now();
    this.foreachAllCddaItem((cddaItem) => {
      cddaItem.finalize();
      if (cddaItem.doSearch()) this.searchs.push(cddaItem);
    });
    const end = performance.now();
    logger.debug(`cddaItemIndexer finalize cost time is ${end - start}ms`);
  }

  resetSearchs() {
    this.searchs.forEach((cddaItem) => cddaItem.doSearch());
  }

  private foreachAllCddaItem(fu: (cddaItem: CddaItem) => void) {
    this.byModIdAndJsonTypeAndId.forEach((byJsonTypeById) => byJsonTypeById.forEach((byId) => byId.forEach(fu)));
  }

  private processLoad(cddaItem: CddaItem) {
    if (cddaItem.load()) {
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
