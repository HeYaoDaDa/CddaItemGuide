import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { ViewUtil } from 'src/utils/ViewUtil';

export class MaterialBreathability extends CddaSubItem {
  str!: string;
  num!: number;

  static init(str?: string) {
    const result = new MaterialBreathability();

    result.str = str ?? BreathabilityRating[0];
    result.num = breathabilityToNumber(result.str);

    return result;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof MaterialBreathability) return this.num === v.num;
    else return false;
  }

  parseJson(jsonObject: unknown) {
    const result = MaterialBreathability.init(typeof jsonObject === 'string' ? jsonObject : undefined);

    Object.assign(this, result);

    return this;
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
