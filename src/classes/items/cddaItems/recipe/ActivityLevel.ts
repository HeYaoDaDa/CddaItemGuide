import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { ViewUtil } from 'src/utils/ViewUtil';

export class ActivityLevel extends CddaSubItem {
  str!: string;
  num!: number;

  static init(str?: string) {
    const result = new ActivityLevel();

    result.str = str ?? 'MODERATE_EXERCISE';
    if (result.str.toLowerCase() === 'fake') result.str = 'MODERATE_EXERCISE';
    result.num = activityToNumber(result.str);
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof ActivityLevel) return this.num === v.num;
    else return false;
  }

  parseJson(jsonObject: unknown) {
    const result = ActivityLevel.init(typeof jsonObject === 'string' ? jsonObject : undefined);

    Object.assign(this, result);

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: `${this.str}(${this.num})` });
  }
}

export enum ActivityLevelMap {
  SLEEP_EXERCISE = 0.85,
  NO_EXERCISE = 1,
  LIGHT_EXERCISE = 2,
  MODERATE_EXERCISE = 4,
  BRISK_EXERCISE = 6,
  ACTIVE_EXERCISE = 8,
  EXTRA_EXERCISE = 10,
}

export function activityToNumber(str: string): number {
  for (const i in ActivityLevelMap) {
    if (str.toUpperCase() === i) {
      return parseFloat(ActivityLevelMap[i]) ?? 4;
    }
  }

  ActivityLevelMap[1];

  return 4;
}
