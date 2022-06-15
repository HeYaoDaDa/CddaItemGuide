import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { MaterialBurn } from './MaterialBurn';

class MaterialBurnVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new MaterialBurn();
  }
}

export const materialBurnVersionFactory = new MaterialBurnVersionFactory();
