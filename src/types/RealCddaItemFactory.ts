import { CddaItemFactory } from './CddaItemFactory';
import { Material } from './cddaItemType/material/Material';
import { ModInfo } from './ModInfo';

export class RealCddaItemFactory extends CddaItemFactory {
  cddaItemTypes = [new ModInfo(), new Material()];
}

export const cddaItemFactory = new RealCddaItemFactory();
