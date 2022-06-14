import { isEqual } from 'lodash';
import { CddaSubItem } from 'src/classes';
import { getBoolean, getNumber } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';

export class FuelExplosion extends CddaSubItem {
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

  parseJson(jsonObject: unknown) {
    this.chanceHot = getNumber(jsonObject, 'chance_hot');
    this.chanceCold = getNumber(jsonObject, 'chance_cold');
    this.factor = getNumber(jsonObject, 'factor');
    this.sizeFactor = getNumber(jsonObject, 'size_factor');
    this.fiery = getBoolean(jsonObject, 'fiery');

    return this;
  }

  doView(util: ViewUtil): void {
    util.addField({ label: 'chanceHot', content: this.chanceHot });
    util.addField({ label: 'chanceCold', content: this.chanceCold });
    util.addField({ label: 'factor', content: this.factor });
    util.addField({ label: 'sizeFactor', content: this.sizeFactor });
    if (this.fiery) util.addField({ label: 'fiery', content: this.fiery });
  }
}
