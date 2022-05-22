import { CddaItemFactory } from './CddaItemFactory';
import { ModInfo } from './ModInfo';

export class RealCddaItemFactory extends CddaItemFactory {
  cddaItemTypes = [new ModInfo()];
}

export const cddaItemFactory = new RealCddaItemFactory();
