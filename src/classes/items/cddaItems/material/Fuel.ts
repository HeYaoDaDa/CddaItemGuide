import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { fuelExplosionVersionFactory } from 'src/classes/factory/cddaSubItem/material/FuelExplosionVersionFactory';
import { CddaItemRef } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getBoolean, getNumber } from 'src/utils/json';
import { getOptionalCddaItemRef, getOptionalCddaSubItem } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/ViewUtil';

export class Fuel extends CddaSubItem {
  energy!: number;
  explosionData?: CddaSubItem;
  pumpTerrain?: CddaItemRef;
  isPerpetualFuel!: boolean;

  parseJson(jsonObject: unknown) {
    this.energy = getNumber(jsonObject, 'energy');
    this.explosionData = getOptionalCddaSubItem(jsonObject, 'explosion_data', fuelExplosionVersionFactory.getProduct());
    this.pumpTerrain = getOptionalCddaItemRef(jsonObject, 'pump_terrain', jsonTypes.terrain);
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
