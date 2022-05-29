import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { MyClass } from 'src/types/EqualClass';
import { getNumber } from 'src/utils/json/baseJsonUtil';
import { getMyClass } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class RequirementQualitie extends MyClass<RequirementQualitie> {
  name!: CddaItemRef;
  level!: number;
  amount!: number;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof RequirementQualitie) return this.name.equal(v.name);
    else return false;
  }

  fromJson(jsonObject: unknown): RequirementQualitie | undefined {
    const result = new RequirementQualitie();
    result.name = getMyClass(jsonObject, 'id', new CddaItemRef(), jsonTypes.quality);
    result.level = getNumber(jsonObject, 'level', 1);
    result.amount = getNumber(jsonObject, 'amount', 1);
    return result;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.name });
    util.addText({ content: `(${this.level}) x ${this.amount}` });
  }
}
