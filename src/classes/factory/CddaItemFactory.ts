import { JsonItem } from 'src/classes';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { AbstractCddaItemVersionFactory } from './cddaItem/AbstractCddaItemVersionFactory';
import { DummyVersionFactory } from './cddaItem/DummyVersionFactory';
import { ModinfoVersionFactory } from './cddaItem/ModinfoVersionFactory';
import { ProficiencyVersionFactory } from './cddaItem/ProficiencyVersionFactory';

class CddaItemFactory {
  factoryMap = new Map<string, AbstractCddaItemVersionFactory>([
    [jsonTypes.modInfo, new ModinfoVersionFactory()],
    [jsonTypes.proficiency, new ProficiencyVersionFactory()],
  ]);

  getCddaItemVersionFactory(jsonItem: JsonItem): AbstractCddaItemVersionFactory {
    return this.factoryMap.get(jsonItem.jsonType) ?? new DummyVersionFactory();
  }
}

export const cddaItemFactory = new CddaItemFactory();
