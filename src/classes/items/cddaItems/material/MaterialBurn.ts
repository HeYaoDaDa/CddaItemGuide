import { isEqual } from 'lodash';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { Volume } from 'src/classes/items';
import { getBoolean, getNumber } from 'src/utils/json';
import { getVolume } from 'src/utils/json/dataJsonUtil';
import ViewUtil from 'src/utils/ViewUtil';

export class MaterialBurn extends CddaSubItem {
  immune!: boolean;
  volumePerTurn!: Volume;
  fuel!: number;
  smoke!: number;
  burn!: number;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof MaterialBurn) return isEqual(this, v);
    else return false;
  }

  parseJson(jsonObject: unknown) {
    this.immune = getBoolean(jsonObject, 'immune');
    this.volumePerTurn = getVolume(jsonObject, 'volume_per_turn');
    this.fuel = getNumber(jsonObject, 'fuel');
    this.smoke = getNumber(jsonObject, 'smoke');
    this.burn = getNumber(jsonObject, 'burn');

    return this;
  }

  doView(util: ViewUtil): void {
    if (this.immune) util.addField({ label: 'immune', content: this.immune });
    util.addField({ label: 'volumePerTurn', content: this.volumePerTurn });
    util.addField({ label: 'fuel', content: this.fuel });
    util.addField({ label: 'smoke', content: this.smoke });
    util.addField({ label: 'burn', content: this.burn });
  }
}
