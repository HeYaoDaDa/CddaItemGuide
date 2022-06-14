import { isEqual } from 'lodash';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getOptionalCddaSubItem } from 'src/utils/json/dataJsonUtil';
import ViewUtil from 'src/utils/ViewUtil';
import { CddaItemRef } from 'src/classes/items';
import { FuelExplosion } from './FuelExplosion';
import { getBoolean, getNumber } from 'src/utils/json';

export class Fuel extends CddaSubItem {
  energy!: number;
  explosionData?: FuelExplosion;
  pumpTerrain?: CddaItemRef;
  isPerpetualFuel!: boolean;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof Fuel) return isEqual(this, v);
    else return false;
  }

  parseJson(jsonObject: unknown) {
    this.energy = getNumber(jsonObject, 'energy');
    this.explosionData = getOptionalCddaSubItem(jsonObject, 'explosion_data', new FuelExplosion());
    this.pumpTerrain = getOptionalCddaSubItem(jsonObject, 'pump_terrain', new CddaItemRef(), jsonTypes.terrain);
    this.isPerpetualFuel = getBoolean(jsonObject, 'perpetual');

    return this;
  }

  doView(util: ViewUtil): void {
    util.addField({ label: 'energy', content: this.energy });
    util.addField({ label: 'explosionData', content: this.explosionData });
    util.addField({ label: 'pumpTerrain', content: this.pumpTerrain });
    if (this.isPerpetualFuel) util.addField({ label: 'isPerpetualFuel', content: this.isPerpetualFuel });
  }
}
