import { getArray, getOptionalString } from 'src/utils/json/baseJsonUtil';
import { CddaItem } from './CddaItem';

export class DummyCddaItem extends CddaItem {
  data = {};
  doSearch(): boolean {
    return false;
  }
  doFinalize(): void {
    return;
  }
  parseJson(): void {
    return;
  }
  parseId(): string[] {
    const jsonObject = this.json as Record<string, unknown>;
    const abstract = getOptionalString(jsonObject, 'abstract');
    if (abstract) return [abstract];
    const ids = getArray(jsonObject, 'id').map((id) => id as string);
    return ids;
  }

  validate(): boolean {
    return true;
  }

  doView(): void {
    return;
  }
}
