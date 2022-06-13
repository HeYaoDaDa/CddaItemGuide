import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import ViewUtil from 'src/utils/ViewUtil';
import { RouteLocationRaw } from 'vue-router';
import { CddaItem } from 'src/classes';
import { CddaSubItem } from 'src/classes';
import { isNotEmpty } from 'src/utils';

export class CddaItemRef extends CddaSubItem {
  id!: string;
  type!: string;
  route!: RouteLocationRaw;
  cddaItem?: CddaItem<object>;

  static init(id: string, type: string) {
    const value = new CddaItemRef();
    value.id = id;
    value.type = type;
    value.route = {
      name: 'cddaItem',
      params: {
        type,
        id,
      },
    };
    return value;
  }

  public getName(): string {
    let name = '';
    if (this.cddaItem) {
      name = this.cddaItem.getRefName();
    } else {
      const cddaItems = cddaItemIndexer.findByTypeAndId(this.type, this.id);
      if (isNotEmpty(cddaItems)) {
        name = cddaItems[0].getRefName();
      }
    }
    if (isNotEmpty(name)) return name;
    else return this.id;
  }

  public getCddaItems() {
    return cddaItemIndexer.findByTypeAndId(this.type, this.id);
  }

  parseJson(jsonObject: string, type: string): this {
    if (typeof jsonObject === 'string' && typeof type === 'string') {
      Object.assign(this, CddaItemRef.init(jsonObject, type));
    } else {
      myLogger.warn('CddaItemRef fromJson is fail, param is ', jsonObject, type);
    }
    return this;
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
