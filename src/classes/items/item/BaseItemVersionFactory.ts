import { CddaItem } from 'src/classes';
import { AbstractCddaItemVersionFactory } from 'src/classes/items/base/AbstractCddaItemVersionFactory';
import { BaseItem } from './BaseItem';

class BaseItemVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new BaseItem();
  }
}

export const baseItemVersionFactory = new BaseItemVersionFactory();
