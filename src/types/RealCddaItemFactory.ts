import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from './CddaItem';
import { CddaItemFactory } from './CddaItemFactory';
import { Material } from './cddaItemType/material/Material';
import { JsonItem } from './JsonItem';
import { ModInfo } from './ModInfo';

export class RealCddaItemFactory extends CddaItemFactory {
  cddaItemTypeMap = new Map<string, CddaItem>([
    [jsonTypes.modInfo, new ModInfo()],
    [jsonTypes.material, new Material()],
  ]);

  findCddaItemType(jsonItem: JsonItem): CddaItem | undefined {
    return this.cddaItemTypeMap.get(jsonItem.jsonType.toLowerCase());
  }
}

export const cddaItemFactory = new RealCddaItemFactory();
