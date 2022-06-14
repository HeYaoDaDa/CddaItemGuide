import { CddaItem } from 'src/classes';
import { Proficiency } from 'src/classes/items/cddaItems/other/Proficiency';
import { AbstractCddaItemVersionFactory } from './AbstractCddaItemVersionFactory';

export class ProficiencyVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Proficiency();
  }
}
