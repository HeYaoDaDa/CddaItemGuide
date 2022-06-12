import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { JsonItem } from 'src/classes';
import { AbstractCddaItemFactory } from './cddaItem/AbstractCddaItemFactory';
import { DummyVersionFactory } from './cddaItem/DummyVersionFactory';
import { ModinfoFactory } from './cddaItem/ModinfoFactory';

class CddaItemFactory {
  factoryMap = new Map<string, AbstractCddaItemFactory>([[jsonTypes.modInfo, new ModinfoFactory()]]);

  getCddaItemVersionFactory(jsonItem: JsonItem): AbstractCddaItemFactory {
    return this.factoryMap.get(jsonItem.jsonType) ?? new DummyVersionFactory();
  }
}

export const cddaItemFactory = new CddaItemFactory();
