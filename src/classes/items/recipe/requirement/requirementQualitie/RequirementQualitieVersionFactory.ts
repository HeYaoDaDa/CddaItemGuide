import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { RequirementQualitie } from './RequirementQualitie';

class RequirementQualitieVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new RequirementQualitie();
  }
}

export const requirementQualitieVersionFactory = new RequirementQualitieVersionFactory();
