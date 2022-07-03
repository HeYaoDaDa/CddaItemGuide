import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { ToHit } from './ToHit';

class ToHitVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new ToHit();
  }
}

export const toHitVersionFactory = new ToHitVersionFactory();
