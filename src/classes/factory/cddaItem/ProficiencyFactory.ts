import { CddaItem } from 'src/classes';
import { Proficiency } from 'src/classes/items/cddaItems/other/Proficiency';
import { AbstractCddaItemFactory } from './AbstractCddaItemFactory';

export class ProficiencyFactory extends AbstractCddaItemFactory {
  doGetProduct(): CddaItem<object> {
    return new Proficiency();
  }
}
