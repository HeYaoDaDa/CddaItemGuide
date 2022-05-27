import { isEqual } from 'lodash';
import { MyClass } from 'src/types/EqualClass';
import { getBoolean, getNumber } from 'src/utils/json/baseJsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class FuelExplosion extends MyClass<FuelExplosion> {
  chanceHot!: number;
  chanceCold!: number;
  factor!: number;
  sizeFactor!: number;
  fiery!: boolean;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof FuelExplosion) return isEqual(this, v);
    else return false;
  }

  fromJson(jsonObject: unknown): FuelExplosion | undefined {
    const result = new FuelExplosion();
    result.chanceHot = getNumber(jsonObject, 'chance_hot');
    result.chanceCold = getNumber(jsonObject, 'chance_cold');
    result.factor = getNumber(jsonObject, 'factor');
    result.sizeFactor = getNumber(jsonObject, 'size_factor');
    result.fiery = getBoolean(jsonObject, 'fiery');
    return result;
  }

  doView(util: ViewUtil): void {
    util.addField({ label: 'chanceHot', content: this.chanceHot });
    util.addField({ label: 'chanceCold', content: this.chanceCold });
    util.addField({ label: 'factor', content: this.factor });
    util.addField({ label: 'sizeFactor', content: this.sizeFactor });
    if (this.fiery) util.addField({ label: 'fiery', content: this.fiery });
  }
}
