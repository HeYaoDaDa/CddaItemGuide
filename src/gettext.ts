import Jed from '@tannin/compat';
import { ref } from 'vue';

export const gettext = ref(
  new Jed({
    locale_data: {
      'cataclysm-dda': {
        '': {
          domain: 'cataclysm-dda',
          lang: 'zh_CN',
          plural_forms: 'nplurals=1; plural=0;',
        },
        test: ['OK singular test', 'OK plural test'],
      },
    },
    domain: 'cataclysm-dda',
  })
);

export function changeGettext(poStr: string) {
  gettext.value = new Jed(JSON.parse(poStr));
}
