import { JsonItem } from 'src/classes';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { AbstractCddaItemVersionFactory } from './cddaItem/AbstractCddaItemVersionFactory';
import { BodyPartVersionFactory } from './cddaItem/bodyPart/BodyPartVersionFactory';
import { SubBodyPartVersionFactory } from './cddaItem/bodyPart/SubBodyPartVersionFactory';
import { DummyVersionFactory } from './cddaItem/DummyVersionFactory';
import { materilaVersionFactory } from './cddaItem/material/MaterialVersionFactory';
import { ModinfoVersionFactory } from './cddaItem/ModinfoVersionFactory';
import { ProficiencyVersionFactory } from './cddaItem/ProficiencyVersionFactory';

class CddaItemFactory {
  factoryMap = new Map<string, AbstractCddaItemVersionFactory>([
    [jsonTypes.modInfo, new ModinfoVersionFactory()],
    [jsonTypes.proficiency, new ProficiencyVersionFactory()],
    [jsonTypes.bodyPart, new BodyPartVersionFactory()],
    [jsonTypes.subBodyPart, new SubBodyPartVersionFactory()],
    [jsonTypes.material, materilaVersionFactory],
  ]);

  getCddaItemVersionFactory(jsonItem: JsonItem): AbstractCddaItemVersionFactory {
    return this.factoryMap.get(jsonItem.jsonType) ?? new DummyVersionFactory();
  }
}

export const cddaItemFactory = new CddaItemFactory();
