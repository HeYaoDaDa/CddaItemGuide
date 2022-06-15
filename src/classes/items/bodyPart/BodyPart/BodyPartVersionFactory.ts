import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { BodyPart } from './BodyPart';

class BodyPartVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new BodyPart();
  }
}

export const bodyPartVersionFactory = new BodyPartVersionFactory();
