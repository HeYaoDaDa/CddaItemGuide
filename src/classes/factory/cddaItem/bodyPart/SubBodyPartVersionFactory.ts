import { CddaItem } from 'src/classes';
import { SubBodyPart } from 'src/classes/items/cddaItems/bodyPart/SubBodyPart';
import { AbstractCddaItemVersionFactory } from 'src/classes/factory/cddaItem/AbstractCddaItemVersionFactory';

export class SubBodyPartVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new SubBodyPart();
  }
}
