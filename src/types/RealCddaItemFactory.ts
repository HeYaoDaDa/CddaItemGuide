import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from './CddaItem';
import { CddaItemFactory } from './CddaItemFactory';
import { BodyPart } from './cddaItemType/bodyPart/BodyPart';
import { SubBodyPart } from './cddaItemType/bodyPart/SubBodyPart';
import { Material } from './cddaItemType/material/Material';
import { Proficiency } from './cddaItemType/other/Proficiency';
import { Requirement } from './cddaItemType/recipe/requirement/Requirement';
import { JsonItem } from './JsonItem';
import { ModInfo } from './ModInfo';

export class RealCddaItemFactory extends CddaItemFactory {
  cddaItemTypeMap = new Map<string, CddaItem<object>>([
    [jsonTypes.modInfo, new ModInfo()],
    [jsonTypes.material, new Material()],
    [jsonTypes.subBodyPart, new SubBodyPart()],
    [jsonTypes.bodyPart, new BodyPart()],
    [jsonTypes.requirement, new Requirement()],
    [jsonTypes.proficiency, new Proficiency()],
  ]);

  findCddaItemType(jsonItem: JsonItem): CddaItem<object> | undefined {
    return this.cddaItemTypeMap.get(jsonItem.jsonType.toLowerCase());
  }
}

export const cddaItemFactory = new RealCddaItemFactory();
