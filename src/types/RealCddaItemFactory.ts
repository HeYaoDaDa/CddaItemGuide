import { CddaItem } from './CddaItem';
import { CddaItemFactory } from './CddaItemFactory';

export class RealCddaItemFactory extends CddaItemFactory {
  findCddaItemType(): CddaItem | undefined {
    return undefined;
  }
}

export const cddaItemFactory = new RealCddaItemFactory();
