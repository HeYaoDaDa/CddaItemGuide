import { myLogger } from 'src/boot/logger';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { getCddaItemRef, getNumber } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { CddaItemRef } from '../../base/CddaItemRef';

export class CddaItemRefWithNumber extends CddaSubItem {
  cddaItemRef!: CddaItemRef;
  count!: number;

  parseJson(jsonObject: unknown, jsonType: string, def?: number): this {
    if (typeof jsonType !== 'string') throw new Error('assert fail!');
    if (!Array.isArray(jsonObject) && typeof jsonObject !== 'string') {
      myLogger.warn(jsonObject);
      throw new Error('assert fail!');
    }

    if (Array.isArray(jsonObject)) {
      this.cddaItemRef = getCddaItemRef(jsonObject, '0', jsonType);
      this.count = getNumber(jsonObject, '1', def ?? 0);
    } else {
      this.cddaItemRef = CddaItemRef.init(jsonObject as string, jsonType);
      this.count = def ?? 0;
    }

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.cddaItemRef });
    util.addText({ content: `(${this.count})` });
  }
}
