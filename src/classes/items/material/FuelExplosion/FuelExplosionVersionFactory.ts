import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { FuelExplosion } from './FuelExplosion';

class FuelExplosionVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new FuelExplosion();
  }
}

export const fuelExplosionVersionFactory = new FuelExplosionVersionFactory();
