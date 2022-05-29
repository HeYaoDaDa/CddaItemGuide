import { MyClass } from 'src/types/EqualClass';
import { ViewUtil } from 'src/utils/viewUtil';

export class MaterialBreathability extends MyClass<MaterialBreathability> {
  str: string;
  num: number;

  constructor(str?: string) {
    super();
    this.str = str ?? BreathabilityRating[0];
    this.num = breathabilityToNumber(this.str);
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof MaterialBreathability) return this.num === v.num;
    else return false;
  }

  fromJson(jsonObject: unknown): MaterialBreathability | undefined {
    const result = new MaterialBreathability(typeof jsonObject === 'string' ? jsonObject : undefined);
    return result;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: `${this.str}(${this.num})` });
  }
}

export enum BreathabilityRating {
  IMPERMEABLE = 0,
  POOR = 30,
  AVERAGE = 50,
  GOOD = 80,
  MOISTURE_WICKING = 110,
  SECOND_SKIN = 140,
}

export function breathabilityToNumber(str: string): number {
  for (const i in BreathabilityRating) {
    const isValueProperty = parseInt(i, 10) >= 0;
    if (!isValueProperty && str.toUpperCase() === i) {
      return parseInt(BreathabilityRating[i], 10) ?? 0;
    }
  }
  return 0;
}
