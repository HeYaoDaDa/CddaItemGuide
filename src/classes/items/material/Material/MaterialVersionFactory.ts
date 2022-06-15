import { CddaItem } from 'src/classes/base/CddaItem';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { Material } from './Material';

class MaterialVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Material();
  }
}

export const materilaVersionFactory = new MaterialVersionFactory();
