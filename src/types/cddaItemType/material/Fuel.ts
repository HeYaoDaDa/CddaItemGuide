import { isEqual } from 'lodash';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { MyClass } from 'src/types/EqualClass';
import { getBoolean, getNumber } from 'src/utils/json/baseJsonUtil';
import { getOptionalMyClass } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { FuelExplosion } from './FuelExplosion';

export class Fuel extends MyClass<Fuel> {
  energy!: number;
  explosionData?: FuelExplosion;
  pumpTerrain?: CddaItemRef;
  isPerpetualFuel!: boolean;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof Fuel) return isEqual(this, v);
    else return false;
  }

  fromJson(jsonObject: unknown): Fuel | undefined {
    const result = new Fuel();
    this.energy = getNumber(jsonObject, 'energy');
    this.explosionData = getOptionalMyClass(jsonObject, 'explosion_data', new FuelExplosion());
    this.pumpTerrain = getOptionalMyClass(jsonObject, 'pump_terrain', new CddaItemRef(), jsonTypes.terrain);
    this.isPerpetualFuel = getBoolean(jsonObject, 'perpetual');
    return result;
  }

  doView(util: ViewUtil): void {
    util.addField({ label: 'energy', content: this.energy });
    util.addField({ label: 'explosionData', content: this.explosionData });
    util.addField({ label: 'pumpTerrain', content: this.pumpTerrain });
    if (this.isPerpetualFuel) util.addField({ label: 'isPerpetualFuel', content: this.isPerpetualFuel });
  }
}
