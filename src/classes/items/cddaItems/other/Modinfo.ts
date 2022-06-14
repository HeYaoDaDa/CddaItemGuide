import { ColDef, ColGroupDef } from 'ag-grid-community';
import { globalI18n } from 'src/boot/i18n';
import { CddaItem } from 'src/classes';
import { CddaItemRef, GettextString } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { readableData } from 'src/utils';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';

export class Modinfo extends CddaItem<ModinfoData> {
  data = {} as ModinfoData;

  doGetName(): string {
    return this.data.name.translate();
  }

  doLoadJson(data: ModinfoData, util: CddaJsonParseUtil): void {
    data.id = this.id;
    data.name = util.getCddaSubItem<GettextString>('name', new GettextString());
    data.description = util.getCddaSubItem<GettextString>('description', new GettextString());
    data.path = util.getString('path');
    data.authors = util.getArray('authors', '');
    data.maintainers = util.getArray('maintainers', '');
    data.version = util.getOptionalString('version');
    data.dependencies = util.getArray('dependencies', new CddaItemRef(), [], jsonTypes.modInfo);
    data.core = util.getBoolean('core');
    data.obsolete = util.getBoolean('obsolete');
    data.category = util.getString('category');
  }

  doFinalize(): void {
    this.weight = 0;
    this.isSearch = true;
    this.data.showCategory = GettextString.init({ str: 'NO CATEGORY' });

    switch (this.data.category) {
      case 'total_conversion':
        this.data.showCategory.str = 'TOTAL CONVERSIONS';
        break;
      case 'content':
        this.data.showCategory.str = 'CORE CONTENT PACKS';
        break;
      case 'items':
        this.data.showCategory.str = 'ITEM ADDITION MODS';
        break;
      case 'creatures':
        this.data.showCategory.str = 'CREATURE MODS';
        break;
      case 'misc_additions':
        this.data.showCategory.str = 'MISC ADDITIONS';
        break;
      case 'buildings':
        this.data.showCategory.str = 'BUILDINGS MODS';
        break;
      case 'vehicles':
        this.data.showCategory.str = 'VEHICLE MODS';
        break;
      case 'rebalance':
        this.data.showCategory.str = 'REBALANCING MODS';
        break;
      case 'magical':
        this.data.showCategory.str = 'MAGICAL MODS';
        break;
      case 'item_exclude':
        this.data.showCategory.str = 'ITEM EXCLUSION MODS';
        break;
      case 'monster_exclude':
        this.data.showCategory.str = 'MONSTER EXCLUSION MODS';
        break;
      case 'graphical':
        this.data.showCategory.str = 'GRAPHICAL MODS';
        break;
    }
  }

  doResetDescription() {
    this.description = this.data.description.translate();
  }

  doView(data: ModinfoData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });

    cardUtil.addField({ label: 'author', content: data.authors });
    cardUtil.addField({ label: 'maintainer', content: data.maintainers });
    cardUtil.addField({ label: 'category', content: data.showCategory });
    cardUtil.addField({ label: 'path', content: data.path });
    cardUtil.addField({ label: 'dependency', content: data.dependencies });
    if (data.version) cardUtil.addField({ label: 'version', content: data.version });
    if (data.core) cardUtil.addField({ label: 'core', content: data.core });
    if (data.obsolete) cardUtil.addField({ label: 'obsolete', content: data.obsolete });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [
      {
        headerValueGetter: () => globalI18n.global.t('label.name'),
        valueGetter: (value) => value.data.getName(),
      },
      { headerValueGetter: () => globalI18n.global.t('label.mod'), valueGetter: (value) => value.data.modId },
      {
        headerValueGetter: () => globalI18n.global.t('label.category'),
        valueGetter: (value) => value.data.data.showCategory.translate(),
      },
      {
        headerValueGetter: () => globalI18n.global.t('label.author'),
        valueGetter: (value) => value.data.data.authors.join(', '),
      },
      { headerValueGetter: () => globalI18n.global.t('label.maintainer'), field: 'data.maintainers' },
      { headerValueGetter: () => globalI18n.global.t('label.dependency'), field: 'data.dependencies' },
      { headerValueGetter: () => globalI18n.global.t('label.path'), field: 'data.path' },
      { headerValueGetter: () => globalI18n.global.t('label.version'), field: 'data.version' },
      {
        headerValueGetter: () => globalI18n.global.t('label.core'),
        valueGetter: (value) => readableData(value.data.data.core),
      },
      {
        headerValueGetter: () => globalI18n.global.t('label.obsolete'),
        valueGetter: (value) => readableData(value.data.data.obsolete),
      },
    ];
  }
}

interface ModinfoData {
  id: string;
  name: GettextString;
  description: GettextString;
  path: string;
  authors: string[];
  maintainers: string[];
  version?: string;
  dependencies: CddaItemRef[];
  core: boolean;
  obsolete: boolean;
  category: string;
  showCategory: GettextString;
}
