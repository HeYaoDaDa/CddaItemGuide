import { ColDef, ColGroupDef } from 'ag-grid-community';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from 'src/types/CddaItem';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { GettextString } from 'src/types/GettextString';
import { JsonItem } from 'src/types/JsonItem';
import { commonParseId } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class SubBodyPart extends CddaItem {
  data = {} as SubBodyPartData;

  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.subBodyPart;
  }

  parseId(): string[] {
    return commonParseId(this.json);
  }

  getName(): string {
    if (this.data.nameMultiple) return this.data.nameMultiple.translate() + '/' + this.data.name.translate();
    else return this.data.name.translate();
  }

  parseJson(data: SubBodyPartData, util: JsonParseUtil): void {
    data.name = util.getMyClass('name', new GettextString());
    data.nameMultiple = util.getOptionalMyClass('name_multiple', new GettextString());
    data.parent = util.getMyClass('parent', new CddaItemRef(), jsonTypes.bodyPart);
    data.opposite = util.getOptionalMyClass('opposite', new CddaItemRef(), jsonTypes.subBodyPart);
    data.maxCoverage = util.getNumber('max_coverage');
    data.secondary = util.getBoolean('secondary');
    data.side = util.getNumber('side');
  }

  doFinalize(): void {
    return;
  }

  prepareSearch(): void {
    this.name = this.getName();
    return;
  }

  doView(data: SubBodyPartData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });
    if (data.nameMultiple) cardUtil.addField({ label: 'nameMultiple', content: data.nameMultiple });
    cardUtil.addField({ label: 'parent', content: data.parent });
    if (data.opposite) cardUtil.addField({ label: 'opposite', content: data.opposite });
    cardUtil.addField({ label: 'maxCoverage', content: data.maxCoverage });
    cardUtil.addField({ label: 'secondary', content: data.secondary });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}

interface SubBodyPartData {
  name: GettextString;
  nameMultiple?: GettextString;
  parent: CddaItemRef;
  opposite?: CddaItemRef;
  maxCoverage: number;
  secondary: boolean;
  side: number;
}
