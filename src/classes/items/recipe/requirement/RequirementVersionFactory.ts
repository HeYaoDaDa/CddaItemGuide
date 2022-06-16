import { CddaItem } from 'src/classes/base/CddaItem';
import { AbstractCddaItemVersionFactory } from '../../base/AbstractCddaItemVersionFactory';
import { Requirement } from './Requirement';

class RequirementVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Requirement();
  }
}

export const requirementVersionFactory = new RequirementVersionFactory();
