import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getBoolean, getNumber, getString } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';

export class ArmorMaterial extends CddaSubItem {
  id!: CddaItemRef;
  coverage!: number;
  thickness!: number;
  ignoreSheetThickness!: boolean;

  parseJson(jsonObject: unknown): this {
    this.id = CddaItemRef.init(getString(jsonObject, 'type'), jsonTypes.material);
    this.coverage = getNumber(jsonObject, 'covered_by_mat', 100);
    this.thickness = getNumber(jsonObject, 'thickness');
    this.ignoreSheetThickness = getBoolean(jsonObject, 'ignore_sheet_thickness');

    return this;
  }

  doView(util: ViewUtil): void {
    util.addField({ label: 'name', content: this.id });
    util.addField({ label: 'coverage', content: this.coverage });
    util.addField({ label: 'thickness', content: this.thickness });
    util.addField({ label: 'ignoreSheetThickness', content: this.ignoreSheetThickness });
  }
}
