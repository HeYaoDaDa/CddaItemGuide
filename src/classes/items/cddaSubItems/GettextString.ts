import { isEqual } from 'lodash';
import { globalGettext } from 'src/gettext';
import ViewUtil from 'src/utils/ViewUtil';
import { CddaSubItem } from 'src/classes';

export class GettextString extends CddaSubItem {
  str?: string;
  ctx?: string;
  str_sp?: string;
  str_pl?: string;
  male?: string;
  female?: string;

  static init(val: GettextStringInterface) {
    const value = new GettextString();

    value.str = val.str;
    value.ctx = val.ctx;
    value.str_sp = val.str_sp;
    value.str_pl = val.str_pl;
    value.male = val.male;
    value.female = val.female;

    return value;
  }

  translate(): string {
    return globalGettext.pgettext(this.ctx, this.str ?? this.str_sp ?? this.str_sp ?? this.male ?? this.female ?? '');
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof GettextString) return isEqual(this, v);
    else return false;
  }

  parseJson(jsonObject: unknown, ctx?: string): this {
    this.ctx = ctx;

    if (typeof jsonObject === 'string') {
      this.str = jsonObject;
    } else if (typeof jsonObject === 'object') {
      const obj = GettextString.init(jsonObject as GettextStringInterface);

      Object.assign(this, obj);
      this.ctx = ctx;
    }

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.translate() });
  }
}

interface GettextStringInterface {
  str?: string;
  ctx?: string;
  str_sp?: string;
  str_pl?: string;
  male?: string;
  female?: string;
}
