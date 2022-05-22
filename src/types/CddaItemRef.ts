import { isEqual } from 'lodash';
import { stringIsNotEmpty } from 'src/utils/commonUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { MyClass } from './EqualClass';

export class CddaItemRef extends MyClass<CddaItemRef> {
  id: string;
  name: string;
  type: string;
  route: RouteLocationRaw;

  constructor(id: string, type: string) {
    super();
    this.id = id;
    this.name = id;
    this.type = type;
    this.route = {
      name: 'jsonItem',
      params: {
        jsonType: type,
        jsonId: id,
      },
    };
    return reactive(this);
  }

  public getName(): string {
    return stringIsNotEmpty(this.name) ? this.name : this.id;
  }

  static getDummyIns(): CddaItemRef {
    return new CddaItemRef('', '');
  }

  fromJson(jsonObject: string, type: string): CddaItemRef | undefined {
    if (typeof jsonObject === 'string' && typeof type === 'string') {
      return new CddaItemRef(jsonObject, type);
    }
    return undefined;
  }

  equal(v: object): boolean {
    return isEqual(this, v);
  }
}
