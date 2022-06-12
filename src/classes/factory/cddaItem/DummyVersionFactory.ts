import { CddaItem } from 'src/classes';
import { Dummy } from 'src/classes/items';
import { AbstractCddaItemFactory } from './AbstractCddaItemFactory';

export class DummyVersionFactory extends AbstractCddaItemFactory {
  doGetProduct(): CddaItem<object> {
    return new Dummy();
  }
}
