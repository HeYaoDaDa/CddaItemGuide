import { CddaItem } from 'src/classes/base/CddaItem';
import { Material } from 'src/classes/items/cddaItems/material/Material';
import { AbstractCddaItemVersionFactory } from '../AbstractCddaItemVersionFactory';

class MaterialVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Material();
  }
}

export const materilaVersionFactory = new MaterialVersionFactory();
