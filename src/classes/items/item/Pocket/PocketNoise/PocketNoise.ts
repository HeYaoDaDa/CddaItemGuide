import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { Volume } from 'src/classes/items';
import { getNumber, getVolume } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';

export class PocketNoise extends CddaSubItem {
  volume!: Volume;
  chance = 0;

  parseJson(jsonObject: unknown): this {
    this.volume = getVolume(jsonObject, 'volume');
    this.chance = getNumber(jsonObject, 'chance');

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.volume });
    util.addText({ content: ` (${this.chance})` });
  }
}
