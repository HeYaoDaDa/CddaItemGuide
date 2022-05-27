import { isEqual } from 'lodash';
import { MyClass } from 'src/types/EqualClass';
import { getBoolean, getNumber } from 'src/utils/json/baseJsonUtil';
import { getVolume } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class MaterialBurn extends MyClass<MaterialBurn> {
  immune!: boolean;
  volumePerTurn!: number;
  fuel!: number;
  smoke!: number;
  burn!: number;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof MaterialBurn) return isEqual(this, v);
    else return false;
  }

  fromJson(jsonObject: unknown): MaterialBurn | undefined {
    const result = new MaterialBurn();
    result.immune = getBoolean(jsonObject, 'immune');
    result.volumePerTurn = getVolume(jsonObject, 'volume_per_turn');
    result.fuel = getNumber(jsonObject, 'fuel');
    result.smoke = getNumber(jsonObject, 'smoke');
    result.burn = getNumber(jsonObject, 'burn');
    return result;
  }

  doView(util: ViewUtil): void {
    if (this.immune) util.addField({ label: 'immune', content: this.immune });
    util.addField({ label: 'volumePerTurn', content: this.volumePerTurn });
    util.addField({ label: 'fuel', content: this.fuel });
    util.addField({ label: 'smoke', content: this.smoke });
    util.addField({ label: 'burn', content: this.burn });
  }
}
