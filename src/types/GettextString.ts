import { logger } from 'src/boot/logger';
import { gettext } from 'src/gettext';
import { reactive } from 'vue';

export class GettextString {
  str?: string;
  ctx?: string;
  str_sp?: string;
  str_pl?: string;
  male?: string;
  female?: string;

  constructor(val: GettextStringInterface) {
    this.str = val.str;
    this.ctx = val.ctx;
    this.str_sp = val.str_sp;
    this.str_pl = val.str_pl;
    this.male = val.male;
    this.female = val.female;
    return reactive(this);
  }

  static parseGetTextTransation(value: unknown, ctx?: string): GettextString | undefined {
    const type = typeof value;
    if (type === 'string') {
      return new GettextString({ str: value as string, ctx: ctx });
    } else if (type === 'object') {
      const obj = new GettextString(value as GettextStringInterface);
      obj.ctx = ctx;
      return obj;
    }
    logger.warn('value no string or object, ', value);
  }

  translate(): string {
    return gettext.pgettext(this.ctx, this.str ?? this.str_sp ?? this.str_sp ?? this.male ?? this.female ?? '');
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
