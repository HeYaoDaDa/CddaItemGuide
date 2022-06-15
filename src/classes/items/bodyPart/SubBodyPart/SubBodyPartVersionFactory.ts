import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { SubBodyPart } from './SubBodyPart';

class SubBodyPartVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new SubBodyPart();
  }
}

export const subBodyPartVersionFactory = new SubBodyPartVersionFactory();
