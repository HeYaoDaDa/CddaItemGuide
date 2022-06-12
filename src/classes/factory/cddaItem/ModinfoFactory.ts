import { CddaItem } from 'src/classes';
import { Modinfo } from 'src/classes/items';
import { AbstractCddaItemFactory } from './AbstractCddaItemFactory';

export class ModinfoFactory extends AbstractCddaItemFactory {
  doGetProduct(): CddaItem<object> {
    return new Modinfo();
  }
}
