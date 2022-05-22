import Jed from '@tannin/compat';
import { markRaw, reactive } from 'vue';

class MyGettext {
  version = 0;
  enabled = false;
  jed = markRaw(new Jed({}));

  constructor() {
    return reactive(this);
  }

  changeGettext(poStr: string) {
    this.jed = new Jed(JSON.parse(poStr));
    this.version++;
    this.enabled = true;
  }

  clear() {
    this.jed = new Jed({});
    this.version++;
    this.enabled = false;
  }

  pgettext(ctx: string | undefined, key: string): string {
    if (this.enabled) return this.jed.pgettext(ctx, key);
    else return key;
  }
}

export const gettext = new MyGettext();
