import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { arrayIsNotEmpty, stringIsNotEmpty } from 'src/utils/commonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { CddaItem } from './CddaItem';
import { MyClass } from './EqualClass';

export class CddaItemRef extends MyClass<CddaItemRef> {
  id!: string;
  type!: string;
  route!: RouteLocationRaw;
  cddaItem?: CddaItem<object>;

  constructor(val?: { id: string; type: string }) {
    super();
    if (val) {
      this.id = val.id;
      this.type = val.type;
      this.route = {
        name: 'cddaItem',
        params: {
          type: val.type,
          id: val.id,
        },
      };
    }
    return reactive(this);
  }

  public getName(): string {
    let name = '';
    if (this.cddaItem) {
      name = this.cddaItem.getName();
    } else {
      const cddaItems = cddaItemIndexer.findByTypeAndId(this.type, this.id);
      if (arrayIsNotEmpty(cddaItems)) {
        name = cddaItems[0].getName();
      }
    }
    if (stringIsNotEmpty(name)) return name;
    else return this.id;
  }

  fromJson(jsonObject: string, type: string): CddaItemRef | undefined {
    if (typeof jsonObject === 'string' && typeof type === 'string') {
      return new CddaItemRef({ id: jsonObject, type });
    } else {
      logger.warn('CddaItemRef fromJson is fail, param is ', jsonObject, type);
    }
    return undefined;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof CddaItemRef) return this.id === v.id && this.type === v.type;
    else return false;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.getName(), route: this.route });
  }
}
