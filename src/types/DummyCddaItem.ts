import { getArray, getOptionalString } from 'src/utils/json/baseJsonUtil';
import { CddaItem } from './CddaItem';

export class DummyCddaItem extends CddaItem<object> {
  data = {};
  doResetSearch() {
    return;
  }
  doFinalize(): void {
    return;
  }
  doLoadJson(): void {
    return;
  }
  parseId(): string[] {
    const jsonObject = this.json as Record<string, unknown>;
    const abstract = getOptionalString(jsonObject, 'abstract');
    if (abstract) return [abstract];
    const ids = getArray(jsonObject, 'id').map((id) => id as string);
    return ids;
  }

  getName(): string {
    return this.id;
  }

  validate() {
    return true;
  }

  doView() {
    return;
  }

  gridColumnDefine() {
    return [];
  }
}
