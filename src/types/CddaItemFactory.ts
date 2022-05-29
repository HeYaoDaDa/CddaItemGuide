import { CddaItem } from './CddaItem';
import { DummyCddaItem } from './DummyCddaItem';
import { JsonItem } from './JsonItem';

export abstract class CddaItemFactory {
  cddaItemTypeMap!: Map<string, CddaItem<object>>;

  generateCddaItem(jsonItem: JsonItem): CddaItem<object> {
    const temple = this.findCddaItemType(jsonItem);
    const newCddaItem = temple
      ? (new (Object.getPrototypeOf(temple).constructor)() as CddaItem<object>)
      : new DummyCddaItem();
    newCddaItem.prepare(jsonItem);
    return newCddaItem;
  }

  abstract findCddaItemType(jsonItem: JsonItem): CddaItem<object> | undefined;
}
