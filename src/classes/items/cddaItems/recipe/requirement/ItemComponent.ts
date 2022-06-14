import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import ViewUtil from 'src/utils/ViewUtil';

export class ItemComponent extends CddaSubItem {
  name!: CddaItemRef;
  count!: number;
  noRecoverable!: boolean;
  requirement!: boolean;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof ItemComponent) return this.name.equal(v.name);
    else return false;
  }

  parseJson(jsonObject: [string, number, string | undefined]) {
    this.count = jsonObject[1];

    const flag = jsonObject[2];

    if (flag) {
      this.requirement = flag.toLowerCase() === 'list';
      this.noRecoverable = flag.toLowerCase() === 'no_recover';
    } else {
      this.requirement = false;
      this.noRecoverable = false;
    }

    this.name = CddaItemRef.init(jsonObject[0], this.requirement ? jsonTypes.requirement : jsonTypes.item);

    return this;
  }

  doView(util: ViewUtil): void {
    if (this.requirement) util.addText({ content: '<requirement>' });
    util.addText({ content: this.name });
    util.addText({ content: ` x ${this.count}` });
    if (this.noRecoverable) util.addText({ content: '(no recover)' });
  }
}
