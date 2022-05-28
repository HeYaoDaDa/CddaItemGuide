import { ColDef, ColGroupDef } from 'ag-grid-community';
import { i18n } from 'src/boot/i18n';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { formatBooleanAndNumber } from 'src/utils/commonUtil';
import { commonParseId } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { CddaItem } from './CddaItem';
import { CddaItemRef } from './CddaItemRef';
import { GettextString } from './GettextString';
import { JsonItem } from './JsonItem';

export class ModInfo extends CddaItem {
  data = {} as ModInfoData;

  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.modInfo;
  }

  parseId(): string[] {
    return commonParseId(this.json);
  }

  getName(): string {
    return this.data.name.translate();
  }

  parseJson(data: ModInfoData, util: JsonParseUtil): void {
    data.id = this.id;
    data.name = util.getMyClass<GettextString>('name', new GettextString());
    data.description = util.getMyClass<GettextString>('description', new GettextString());

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
    this.data.showCategory = new GettextString({ str: 'NO CATEGORY' });
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

  prepareSearch() {
    this.weight = 0;
    this.isSearch = true;
    this.name = this.getName();
    this.description = this.data.description.translate();
  }

  doView(data: ModInfoData, util: ViewUtil): void {
    const cardUtil = util.addCard({});
    cardUtil.addField({ label: 'name', content: data.name });
    cardUtil.addField({ label: 'description', content: data.description });
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
        headerValueGetter: () => i18n.global.t('label.name'),
        valueGetter: (value) => value.data.data.name.translate(),
      },
      { headerValueGetter: () => i18n.global.t('label.mod'), valueGetter: (value) => value.data.modId },
      {
        headerValueGetter: () => i18n.global.t('label.category'),
        valueGetter: (value) => value.data.data.showCategory.translate(),
      },
      {
        headerValueGetter: () => i18n.global.t('label.author'),
        valueGetter: (value) => value.data.data.authors.join(', '),
      },
      { headerValueGetter: () => i18n.global.t('label.maintainer'), field: 'data.maintainers' },
      { headerValueGetter: () => i18n.global.t('label.dependency'), field: 'data.dependencies' },
      { headerValueGetter: () => i18n.global.t('label.path'), field: 'data.path' },
      { headerValueGetter: () => i18n.global.t('label.version'), field: 'data.version' },
      {
        headerValueGetter: () => i18n.global.t('label.core'),
        valueGetter: (value) => formatBooleanAndNumber(value.data.data.core),
      },
      {
        headerValueGetter: () => i18n.global.t('label.obsolete'),
        valueGetter: (value) => formatBooleanAndNumber(value.data.data.obsolete),
      },
    ];
  }
}

interface ModInfoData {
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
