import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getArray } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
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
    data.name = util.getGettextString('name');
    data.description = util.getGettextString('description');
    data.path = util.getString('path');
    data.authors = util.getArray('authors', '');
    data.maintainers = util.getArray('maintainers', '');
    data.version = util.getOptionalString('version');
    data.dependencies = util.getArray('dependencies', CddaItemRef.getDummyIns(), [], jsonTypes.modInfo);
    data.core = util.getBoolean('core');
    data.obsolete = util.getBoolean('obsolete');
    data.category = util.getGettextString('category');
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
  category: GettextString;
}
