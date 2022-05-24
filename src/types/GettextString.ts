import { isEqual } from 'lodash';
import { logger } from 'src/boot/logger';
import { gettext } from 'src/gettext';
import { ViewUtil } from 'src/utils/viewUtil';
import { reactive } from 'vue';
import { MyClass } from './EqualClass';

export class GettextString extends MyClass<GettextString> {
  str?: string;
  ctx?: string;
  str_sp?: string;
  str_pl?: string;
  male?: string;
  female?: string;

  constructor(val?: GettextStringInterface) {
    super();
    if (val) {
      this.str = val.str;
      this.ctx = val.ctx;
      this.str_sp = val.str_sp;
      this.str_pl = val.str_pl;
      this.male = val.male;
      this.female = val.female;
    }
    return reactive(this);
  }

  translate(): string {
    return gettext.pgettext(this.ctx, this.str ?? this.str_sp ?? this.str_sp ?? this.male ?? this.female ?? '');
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof GettextString) return isEqual(this, v);
    else return false;
  }

  fromJson(jsonObject: unknown, ctx?: string): GettextString | undefined {
    const type = typeof jsonObject;
    if (type === 'string') {
      return new GettextString({ str: jsonObject as string, ctx });
    } else if (type === 'object') {
      const obj = new GettextString(jsonObject as GettextStringInterface);
      obj.ctx = ctx;
      return obj;
    }
    logger.warn('value no string or object, ', jsonObject);
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
