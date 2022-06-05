import { MyClass } from 'src/types/EqualClass';
import { ViewUtil } from 'src/utils/viewUtil';

export class ActivityLevel extends MyClass<ActivityLevel> {
  str: string;
  num: number;

  constructor(str?: string) {
    super();
    this.str = str ?? 'MODERATE_EXERCISE';
    if (this.str.toLowerCase() === 'fake') this.str = 'MODERATE_EXERCISE';
    this.num = activityToNumber(this.str);
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof ActivityLevel) return this.num === v.num;
    else return false;
  }

  fromJson(jsonObject: unknown): ActivityLevel | undefined {
    const result = new ActivityLevel(typeof jsonObject === 'string' ? jsonObject : undefined);
    return result;
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
