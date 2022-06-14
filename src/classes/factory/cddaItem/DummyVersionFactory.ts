import { CddaItem } from 'src/classes';
import { Dummy } from 'src/classes/items/cddaItems/other/Dummy';
import { AbstractCddaItemVersionFactory } from './AbstractCddaItemVersionFactory';

export class DummyVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Dummy();
  }
}
