import { CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { Sealablethis } from './Sealablethis';

class SealablethisVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new Sealablethis();
  }
}

export const sealablethisVersionFactory = new SealablethisVersionFactory();
