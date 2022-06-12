import { getArray, getBoolean, getString } from 'src/utils/json';
import { getCddaSubItem } from 'src/utils/json/dataJsonUtil';
import { GettextString } from 'src/classes/items';
import { JsonItem } from './JsonItem';

export class BaseMod {
  id: string;
  name: GettextString;
  obsolete: boolean;
  dependencies: string[];

  constructor(jsonItem: JsonItem) {
    const jsonObject = jsonItem.json;
    this.id = getString(jsonObject, 'id');
    this.name = getCddaSubItem(jsonObject, 'name', new GettextString());
    this.obsolete = getBoolean(jsonObject, 'obsolete');
    this.dependencies = getArray(jsonObject, 'dependencies').map((v) => v as string);
  }
}
