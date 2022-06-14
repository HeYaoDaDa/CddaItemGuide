import { CddaItem } from 'src/classes';
import { Modinfo } from 'src/classes/items';
import { AbstractCddaItemVersionFactory } from './AbstractCddaItemVersionFactory';

export class ModinfoVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Modinfo();
  }
}
