import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { Proficiency } from './Proficiency';

class ProficiencyVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Proficiency();
  }
}

export const proficiencyVersionFactory = new ProficiencyVersionFactory();
