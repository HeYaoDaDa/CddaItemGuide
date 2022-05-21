import { CddaItem } from './CddaItem';

export class DummyCddaItem extends CddaItem {
  validate(): boolean {
    return true;
  }
}
