import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { getNumber } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';

export class Sealablethis extends CddaSubItem {
  spoilMultiplier!: number;

  parseJson(jsonObject: unknown): this {
    this.spoilMultiplier = getNumber(jsonObject, 'spoil_multiplier', 1);

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.spoilMultiplier });
  }
}
