import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes';
import { CddaItemRef, GettextString } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import CddaJsonParseUtil from 'src/utils/json/CddaJsonParseUtil';
import ViewUtil from 'src/utils/ViewUtil';

export class SubBodyPart extends CddaItem<SubBodyPartData> {
  data = {} as SubBodyPartData;

  doGetName() {
    return this.data.name.translate();
  }

  doGetRefName() {
    if (this.data.nameMultiple) return this.data.nameMultiple.translate() + '/' + this.data.name.translate();
  }

  doLoadJson(data: SubBodyPartData, util: CddaJsonParseUtil): void {
    data.name = util.getGettextString('name');
    data.nameMultiple = util.getGettextString('name_multiple');
    data.parent = util.getCddaItemRef('parent', jsonTypes.bodyPart);
    data.opposite = util.getOptionalCddaItemRef('opposite', jsonTypes.subBodyPart);
    data.maxCoverage = util.getNumber('max_coverage');
    data.secondary = util.getBoolean('secondary');
    data.side = util.getNumber('side');
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
