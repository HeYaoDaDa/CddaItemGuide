import { stringIsNotEmpty } from 'src/utils/commonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { MyClass } from './EqualClass';

export class CddaItemRef extends MyClass<CddaItemRef> {
  id!: string;
  name!: string;
  type!: string;
  route!: RouteLocationRaw;

  constructor(val?: { id: string; type: string }) {
    super();
    if (val) {
      this.id = val.id;
      this.name = val.id;
      this.type = val.type;
      this.route = {
        name: 'jsonItem',
        params: {
          jsonType: val.type,
          jsonId: val.id,
        },
      };
    }
    return reactive(this);
  }

  public getName(): string {
    return stringIsNotEmpty(this.name) ? this.name : this.id;
  }

  fromJson(jsonObject: string, type: string): CddaItemRef | undefined {
    if (typeof jsonObject === 'string' && typeof type === 'string') {
      return new CddaItemRef({ id: jsonObject, type });
    }
    return undefined;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof CddaItemRef) return this.id === v.id && this.type === v.type;
    else return false;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.id, route: this.route });
  }
}
