import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { CddaItemRefWithNumber } from './CddaItemRefWithNumber';

class CddaItemRefWithNumberVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new CddaItemRefWithNumber();
  }
}

export const cddaItemRefWithNumberVersionFactory = new CddaItemRefWithNumberVersionFactory();
