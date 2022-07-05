import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { ViewUtil } from 'src/utils/ViewUtil';
import { CddaItemRef } from 'src/classes/items';

export class AmmoRestrictionItem extends CddaSubItem {
  armor!: CddaItemRef;
  number = 0;

  parseJson(jsonObject: unknown): this {
    const temp = jsonObject as [string, number];

    this.armor = CddaItemRef.init(temp[0], jsonTypes.ammo);
    this.number = temp[1];

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.armor });
    util.addText({ content: ` (${this.number})` });
  }
}
