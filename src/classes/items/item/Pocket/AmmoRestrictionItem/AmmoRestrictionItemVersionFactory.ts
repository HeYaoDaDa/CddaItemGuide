import { CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { AmmoRestrictionItem } from './AmmoRestrictionItem';

class AmmoRestrictionItemVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new AmmoRestrictionItem();
  }
}

export const ammoRestrictionItemVersionFactory = new AmmoRestrictionItemVersionFactory();
