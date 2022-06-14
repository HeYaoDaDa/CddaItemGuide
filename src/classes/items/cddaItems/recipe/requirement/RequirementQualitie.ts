import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getNumber } from 'src/utils/json';
import { getCddaSubItem } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/ViewUtil';

export class RequirementQualitie extends CddaSubItem {
  name!: CddaItemRef;
  level!: number;
  amount!: number;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof RequirementQualitie) return this.name.equal(v.name);
    else return false;
  }

  parseJson(jsonObject: unknown) {
    this.name = getCddaSubItem(jsonObject, 'id', new CddaItemRef(), jsonTypes.quality);
    this.level = getNumber(jsonObject, 'level', 1);
    this.amount = getNumber(jsonObject, 'amount', 1);

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.name });
    util.addText({ content: `(${this.level}) x ${this.amount}` });
  }
}
