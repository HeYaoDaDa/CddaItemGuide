import { Loading } from 'quasar';
import { JsonItem } from 'src/classes';
import { cddaItemFactory } from 'src/classes/factory/CddaItemFactory';
import { cloneDeep, includes, isEmpty, itemType2JsonType, popFilter, replaceArray } from 'src/utils';
import { ref } from 'vue';
import { getAllJsonItems } from './apis/jsonItemApi';
import { globalI18n } from './boot/i18n';
import { myLogger } from './boot/logger';
import { CddaItem } from './classes';
import { jsonTypes } from './constants/jsonTypesConstant';
import { getJsonItemSetByVersionId, saveJsonItemSet } from './services/jsonItemSetService';
import { hasVersionById, saveVersion } from './services/versionsService';
import { useConfigOptionsStore } from './stores/configOptions';
import { useUserConfigStore } from './stores/userConfig';

export class CddaItemIndexer {
  byModIdAndJsonTypeAndId: Map<string, Map<string, Map<string, CddaItem<object>>>> = new Map();
  byModIdAndJsonType: Map<string, Map<string, CddaItem<object>[]>> = new Map();
  modinfos: CddaItem<object>[] = [];
  deferred: Map<string, CddaItem<object>[]> = new Map();
  searchs: CddaItem<object>[] = [];
  finalized = ref(false);

  findByTypeAndId(type: string, id: string): CddaItem<object>[] {
    const userConfig = useUserConfigStore();
    return this.findByModsByTypeAndId(userConfig.modIds, type, id);
  }

  findByModsByTypeAndId(modIds: string[], type: string, id: string): CddaItem<object>[] {
    const jsonTypes = itemType2JsonType(type);
    const result = new Array<CddaItem<object>>();
    modIds.forEach((modId) =>
      jsonTypes.forEach((fJsonType) => {
        const find = this.byModIdAndJsonTypeAndId.get(modId)?.get(fJsonType)?.get(id);
        if (find) result.push(find);
      })
    );
    return result;
  }

  findByType(type: string): CddaItem<object>[] {
    const userConfig = useUserConfigStore();
    return this.findByModsByType(userConfig.modIds, type);
  }

  findByModsByType(modIds: string[], type: string): CddaItem<object>[] {
    const jsonTypes = itemType2JsonType(type);
    const result = new Array<CddaItem<object>>();
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
    if (loadLock) Loading.show({ message: globalI18n.global.t('message.gameData') });
    const start = performance.now();
    myLogger.debug('start init CddaItemIndexer');
    const configOptions = useConfigOptionsStore();
    const jsonItems = await this.getJsonItems();
    this.clear();
    this.addJsonItems(jsonItems);
    configOptions.updateMods();
    this.processCopyFroms();
    this.finalized.value = true;
    const end = performance.now();
    myLogger.debug(
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
      myLogger.debug(`version id ${userConfig.versionId} is has in db.`);
      const dbJsonItemSet = await getJsonItemSetByVersionId(userConfig.versionId);
      if (dbJsonItemSet) {
        replaceArray(jsonItems, dbJsonItemSet.jsonItems);
      }
    } else {
      const newVersion = configOptions.findVersionById(userConfig.versionId);
      myLogger.debug(`version id ${userConfig.versionId} is no in db. start save`);
      if (newVersion) {
        const remoteJsonItems = await getAllJsonItems(newVersion);
        saveJsonItemSet({ versionId: userConfig.versionId, jsonItems: remoteJsonItems })
          .then(() => saveVersion(newVersion))
          .catch((e) => myLogger.error('save jsonItemSet and save Version fail, ', e));
        replaceArray(jsonItems, remoteJsonItems);
      } else {
        myLogger.error(`new version ${userConfig.versionId} is no find in config Options, Why?`);
      }
    }
    const end = performance.now();
    myLogger.debug(`cddaItemIndexer getJsonItems cost time is ${end - start}ms`);
    return jsonItems;
  }

  private addJsonItems(jsonItems: JsonItem[]) {
    const start = performance.now();
    jsonItems.forEach((jsonItem) => this.addJsonItem(jsonItem));
    const end = performance.now();
    myLogger.debug(`cddaItemIndexer prepare cost time is ${end - start}ms`);
  }

  private addJsonItem(jsonItem: JsonItem) {
    const cddaItem = cddaItemFactory.getCddaItemVersionFactory(jsonItem).getProduct();
    cddaItem.prepare(jsonItem);
    this.addCddaItem(cddaItem);
  }

  private addCddaItem(cddaItem: CddaItem<object>) {
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

  private addCddaItemWithJsonId(cddaItem: CddaItem<object>) {
    if (!this.byModIdAndJsonTypeAndId.has(cddaItem.modId)) this.byModIdAndJsonTypeAndId.set(cddaItem.modId, new Map());
    const byJsonTypeById = this.byModIdAndJsonTypeAndId.get(cddaItem.modId) as Map<
      string,
      Map<string, CddaItem<object>>
    >;
    if (!byJsonTypeById.has(cddaItem.jsonType)) byJsonTypeById.set(cddaItem.jsonType, new Map());
    byJsonTypeById.get(cddaItem.jsonType)?.set(cddaItem.id, cddaItem);

    if (!this.byModIdAndJsonType.has(cddaItem.modId)) this.byModIdAndJsonType.set(cddaItem.modId, new Map());
    const byJsonType = this.byModIdAndJsonType.get(cddaItem.modId) as Map<string, CddaItem<object>[]>;
    if (!byJsonType.has(cddaItem.jsonType)) byJsonType.set(cddaItem.jsonType, []);
    byJsonType.get(cddaItem.jsonType)?.push(cddaItem);

    if (cddaItem.jsonType === jsonTypes.modInfo) this.modinfos.push(cddaItem);
  }

  private processCopyFroms() {
    const start = performance.now();
    this.foreachAllCddaItem((cddaItem) => {
      this.processLoad(cddaItem);
      if (cddaItem.isSearch) this.searchs.push(cddaItem);
    });
    const deferreds = new Array<CddaItem<object>>();
    this.deferred.forEach((value) => deferreds.push(...value));
    myLogger.warn('deferred has ', deferreds.length, deferreds);
    myLogger.debug('processCopyFroms end');
    const end = performance.now();
    myLogger.debug(`cddaItemIndexer load cost time is ${end - start}ms`);
  }

  resetSearchs() {
    this.searchs.forEach((cddaItem) => cddaItem.resetSearch());
  }

  private foreachAllCddaItem(fu: (cddaItem: CddaItem<object>) => void) {
    this.byModIdAndJsonTypeAndId.forEach((byJsonTypeById) => byJsonTypeById.forEach((byId) => byId.forEach(fu)));
  }

  private processLoad(cddaItem: CddaItem<object>) {
    if (cddaItem.loadJson()) {
      this.processSubInDeferred(cddaItem.modId, cddaItem.jsonType, cddaItem.id);
    } else {
      this.addDeferred(cddaItem);
    }
  }

  private addDeferred(cddaItem: CddaItem<object>) {
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
          myLogger.error('why a no copyFromInfo cddaItem in deferred?', deferredItem);
          return false;
        }
      }).forEach((deferredItem) => this.processLoad(deferredItem));
      if (isEmpty(deferreds)) this.deferred.delete(id);
    }
  }
}

export const cddaItemIndexer = new CddaItemIndexer();
