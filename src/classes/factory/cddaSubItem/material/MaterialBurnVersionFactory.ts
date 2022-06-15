import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { MaterialBurn } from 'src/classes/items/cddaSubItems/material/MaterialBurn';
import { AbstractCddaSubItemVersionFactory } from '../AbstractCddaSubItemFactory';

class MaterialBurnVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new MaterialBurn();
  }
}

export const materialBurnVersionFactory = new MaterialBurnVersionFactory();
