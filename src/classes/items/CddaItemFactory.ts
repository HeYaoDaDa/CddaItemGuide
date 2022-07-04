import { JsonItem } from 'src/classes';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isItemByjsonType } from 'src/utils';
import { AbstractCddaItemVersionFactory } from './base/AbstractCddaItemVersionFactory';
import { bodyPartVersionFactory } from './bodyPart/BodyPart/BodyPartVersionFactory';
import { subBodyPartVersionFactory } from './bodyPart/SubBodyPart/SubBodyPartVersionFactory';
import { baseItemVersionFactory } from './item/BaseItemVersionFactory';
import { materilaVersionFactory } from './material/Material/MaterialVersionFactory';
import { dummyVersionFactory } from './other/Dummy/DummyVersionFactory';
import { modinfoVersionFactory } from './other/Modinfo/ModinfoVersionFactory';
import { proficiencyVersionFactory } from './other/Proficiency/ProficiencyVersionFactory';
import { recipeVersionFactory } from './recipe/RecipeVersionFactory';
import { requirementVersionFactory } from './recipe/requirement/RequirementVersionFactory';

class CddaItemFactory {
  factoryMap = new Map<string, AbstractCddaItemVersionFactory>([
    [jsonTypes.modInfo, modinfoVersionFactory],
    [jsonTypes.proficiency, proficiencyVersionFactory],
    [jsonTypes.bodyPart, bodyPartVersionFactory],
    [jsonTypes.subBodyPart, subBodyPartVersionFactory],
    [jsonTypes.material, materilaVersionFactory],
    [jsonTypes.requirement, requirementVersionFactory],
    [jsonTypes.recipe, recipeVersionFactory],
  ]);

  getCddaItemVersionFactory(jsonItem: JsonItem): AbstractCddaItemVersionFactory {
    if (isItemByjsonType(jsonItem.jsonType)) return baseItemVersionFactory;

    return this.factoryMap.get(jsonItem.jsonType) ?? dummyVersionFactory;
  }
}

export const cddaItemFactory = new CddaItemFactory();
