import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { Modinfo } from './Modinfo';

class ModinfoVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Modinfo();
  }
}

export const modinfoVersionFactory = new ModinfoVersionFactory();
