import { CddaItem } from 'src/classes';
import { BodyPart } from 'src/classes/items/cddaItems/bodyPart/BodyPart';
import { AbstractCddaItemVersionFactory } from 'src/classes/factory/cddaItem/AbstractCddaItemVersionFactory';

export class BodyPartVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new BodyPart();
  }
}
