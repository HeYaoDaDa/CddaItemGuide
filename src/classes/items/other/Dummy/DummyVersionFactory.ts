import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { Dummy } from './Dummy';

class DummyVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Dummy();
  }
}

export const dummyVersionFactory = new DummyVersionFactory();
