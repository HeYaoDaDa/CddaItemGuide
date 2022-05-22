import { CddaItem } from './CddaItem';
import { DummyCddaItem } from './DummyCddaItem';
import { JsonItem } from './JsonItem';

export abstract class CddaItemFactory {
  cddaItemTypes = new Array<CddaItem>();
  generateCddaItem(jsonItem: JsonItem): CddaItem {
    const temple = this.findCddaItemType(jsonItem);
    const newCddaItem = temple ? new (Object.getPrototypeOf(temple).constructor)() : new DummyCddaItem();
    newCddaItem.loadJsonItem(jsonItem);
    return newCddaItem;
  }

  findCddaItemType(jsonItem: JsonItem): CddaItem | undefined {
    return this.cddaItemTypes.find((cddaItemType) => cddaItemType.validate(jsonItem));
  }
}
