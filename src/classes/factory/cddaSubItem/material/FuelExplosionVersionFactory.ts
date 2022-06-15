import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { FuelExplosion } from 'src/classes/items/cddaItems/material/FuelExplosion';
import { AbstractCddaSubItemVersionFactory } from '../AbstractCddaSubItemFactory';

class FuelExplosionVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new FuelExplosion();
  }
}

export const fuelExplosionVersionFactory = new FuelExplosionVersionFactory();
