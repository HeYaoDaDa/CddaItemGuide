import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { MyClass } from 'src/types/EqualClass';
import { ViewUtil } from 'src/utils/viewUtil';

export class ToolComponent extends MyClass<ToolComponent> {
  name!: CddaItemRef;
  count!: number;
  noRecoverable!: boolean;
  requirement!: boolean;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof ToolComponent) return this.name.equal(v.name);
    else return false;
  }

  fromJson(jsonObject: [string, number, string | undefined]): ToolComponent | undefined {
    const result = new ToolComponent();
    result.count = jsonObject[1];
    const flag = jsonObject[2];
    if (flag) {
      result.requirement = flag.toLowerCase() === 'list';
      result.noRecoverable = flag.toLowerCase() === 'no_recover';
    } else {
      result.requirement = false;
      result.noRecoverable = false;
    }
    result.name = new CddaItemRef({
      id: jsonObject[0],
      type: result.requirement ? jsonTypes.requirement : jsonTypes.item,
    });
    return result;
  }

  doView(util: ViewUtil): void {
    if (this.requirement) util.addText({ content: '<requirement>' });
    util.addText({ content: this.name });
    util.addText({ content: ` x ${this.count}` });
    if (this.noRecoverable) util.addText({ content: '(no recover)' });
  }
}
