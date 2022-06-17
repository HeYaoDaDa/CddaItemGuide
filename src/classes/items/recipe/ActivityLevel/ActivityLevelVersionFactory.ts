import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { ActivityLevel } from './ActivityLevel';

class ActivityLevelVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new ActivityLevel();
  }
}

export const activityLevelVersionFactory = new ActivityLevelVersionFactory();
