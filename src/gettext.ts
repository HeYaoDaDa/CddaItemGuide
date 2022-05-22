import Jed from '@tannin/compat';

export let gettext = new Jed({
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
});

export function changeGettext(poStr: string) {
  gettext = new Jed(JSON.parse(poStr));
}
