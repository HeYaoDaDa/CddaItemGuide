import { jsonTypes } from './constants/jsonTypesConstant';
import { CddaItem } from './types/CddaItem';
import { JsonItem } from './types/JsonItem';
import { cddaItemFactory } from './types/RealCddaItemFactory';

export class CddaItemIndexer {
  byModIdAndJsonTypeAndId: Map<string, Map<string, Map<string, CddaItem>>> = new Map();
  modinfos: CddaItem[] = [];

  clear() {
    this.byModIdAndJsonTypeAndId.clear();
    this.modinfos.length = 0;
  }

  addJsonItems(jsonItems: JsonItem[]) {
    jsonItems.forEach((jsonItem) => this.addJsonItem(jsonItem));
  }

  addJsonItem(jsonItem: JsonItem) {
    const cddaItem = cddaItemFactory.generateCddaItem(jsonItem);
    this.addCddaItem(cddaItem);
  }

  addCddaItem(cddaItem: CddaItem) {
    if (!cddaItem.id) return;
    if (!this.byModIdAndJsonTypeAndId.has(cddaItem.modId)) this.byModIdAndJsonTypeAndId.set(cddaItem.modId, new Map());
    const byJsonTypeById = this.byModIdAndJsonTypeAndId.get(cddaItem.modId) as Map<string, Map<string, CddaItem>>;
    if (!byJsonTypeById.has(cddaItem.jsonType)) byJsonTypeById.set(cddaItem.jsonType, new Map());
    const byId = byJsonTypeById.get(cddaItem.jsonType) as Map<string, CddaItem>;
    if (!byId.has(cddaItem.id)) byId.set(cddaItem.id, cddaItem);

    if (cddaItem.jsonType === jsonTypes.modInfo) this.modinfos.push(cddaItem);
  }
}

export const cddaItemIndexer = new CddaItemIndexer();
