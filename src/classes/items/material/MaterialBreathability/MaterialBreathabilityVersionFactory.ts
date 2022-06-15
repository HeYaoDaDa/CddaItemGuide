import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { MaterialBreathability } from './MaterialBreathability';

class MaterialBreathabilityVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new MaterialBreathability();
  }
}

export const materialBreathabilityVersionFactory = new MaterialBreathabilityVersionFactory();
