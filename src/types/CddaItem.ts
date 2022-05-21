import { JsonItem } from './JsonItem';

export abstract class CddaItem {
  finalize = false;

  json!: object;
  path!: string;
  modId!: string;
  jsonType!: string;
  id?: string;
  /**
   * validate is match JsonItem
   * @param jsonItem jsonItem object
   */
  abstract validate(jsonItem: JsonItem): boolean;

  loadJsonItem(jsonItem: JsonItem) {
    this.json = jsonItem.json;
    this.modId = jsonItem.modId;
    this.path = jsonItem.path;
    this.jsonType = jsonItem.jsonType;
    //TODO:need fix
    if (jsonItem.json.hasOwnProperty('id')) {
      this.id = (<{ id: string }>jsonItem.json).id;
    }
  }
}
