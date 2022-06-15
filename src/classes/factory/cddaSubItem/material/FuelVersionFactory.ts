import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { Fuel } from 'src/classes/items/cddaItems/material/Fuel';
import { AbstractCddaSubItemVersionFactory } from '../AbstractCddaSubItemFactory';

class FuelVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new Fuel();
  }
}

export const fuelVersionFactory = new FuelVersionFactory();
