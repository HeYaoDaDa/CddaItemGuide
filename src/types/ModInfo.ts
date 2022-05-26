import { ColGroupDef, ColDef } from 'ag-grid-community';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getArray } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { reactive } from 'vue';
import { CddaItem } from './CddaItem';
import { CddaItemRef } from './CddaItemRef';
import { GettextString } from './GettextString';
import { JsonItem } from './JsonItem';

export class ModInfo extends CddaItem {
  data = reactive({} as ModInfoData);

  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.modInfo;
  }

  parseId(): string[] {
    const jsonObject = this.json as Record<string, unknown>;
    return getArray(jsonObject, 'id').map((id) => id as string);
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

  doSearch(): boolean {
    this.sreachParam = {
      category: 'Mod',
      weight: 0,
      name: this.data.name.translate(),
      description: this.data.description.translate(),
    };
    return true;
  }

  doView(data: ModInfoData, util: ViewUtil): void {
    const cardUtil = util.addCard({});
    cardUtil.addField({ label: 'name', content: data.name });
    cardUtil.addField({ label: 'description', content: data.description });
    cardUtil.addField({ label: 'authors', content: data.authors });
    cardUtil.addField({ label: 'maintainers', content: data.maintainers });
    cardUtil.addField({ label: 'category', content: data.showCategory });
    cardUtil.addField({ label: 'path', content: data.path });
    cardUtil.addField({ label: 'dependencies', content: data.dependencies });
    if (data.version) cardUtil.addField({ label: 'version', content: data.version });
    if (data.core) cardUtil.addField({ label: 'core', content: data.core });
    if (data.obsolete) cardUtil.addField({ label: 'obsolete', content: data.obsolete });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return reactive([
      { headerName: 'name', valueGetter: (value) => value.data.data.name.translate() },
      { headerName: 'mod', valueGetter: (value) => value.data.modId },
      { headerName: 'category', valueGetter: (value) => value.data.data.showCategory.translate() },
      { headerName: 'authors', valueGetter: (value) => value.data.data.authors.join(', ') },
      { headerName: 'maintainers', field: 'data.maintainers' },
      { headerName: 'dependencies', field: 'data.dependencies' },
      { headerName: 'path', field: 'data.path' },
      { headerName: 'version', field: 'data.version' },
      { headerName: 'core', field: 'data.core' },
      { headerName: 'obsolete', field: 'data.obsolete' },
    ]);
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
