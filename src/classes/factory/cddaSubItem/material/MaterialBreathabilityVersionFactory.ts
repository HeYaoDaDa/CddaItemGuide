import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { MaterialBreathability } from 'src/classes/items/cddaItems/material/MaterialBreathability';
import { AbstractCddaSubItemVersionFactory } from '../AbstractCddaSubItemFactory';

class MaterialBreathabilityVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new MaterialBreathability();
  }
}

export const materialBreathabilityVersionFactory = new MaterialBreathabilityVersionFactory();
