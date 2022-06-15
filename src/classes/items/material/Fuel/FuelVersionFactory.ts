import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { Fuel } from './Fuel';

class FuelVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new Fuel();
  }
}

export const fuelVersionFactory = new FuelVersionFactory();
