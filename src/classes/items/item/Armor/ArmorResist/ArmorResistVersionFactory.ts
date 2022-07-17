import { CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { ArmorResist } from './ArmorResist';

class ArmorResistVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new ArmorResist();
  }
}

export const armorResistVersionFactory = new ArmorResistVersionFactory();
