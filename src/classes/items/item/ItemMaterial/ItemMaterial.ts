import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { ViewUtil } from 'src/utils/ViewUtil';
import { CddaItemRef } from '../../base/CddaItemRef';

export class ItemMaterial extends CddaSubItem {
  material!: CddaItemRef;
  portion = 1;

  parseJson(jsonObject: unknown): this {
    if (typeof jsonObject === 'string') {
      this.material = CddaItemRef.init(jsonObject, jsonTypes.material);
    } else {
      const material = jsonObject as { type: string; portion?: number };

      this.material = CddaItemRef.init(material.type, jsonTypes.material);
      this.portion = material.portion ?? 1;
    }

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.material });
    util.addText({ content: ` (${this.portion})` });
  }
}
