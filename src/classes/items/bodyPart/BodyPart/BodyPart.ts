import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes/base/CddaItem';
import { CddaItemRef, GettextString } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';

export class BodyPart extends CddaItem<BodyPartData> {
  data = {} as BodyPartData;

  doLoadJson(data: BodyPartData, util: CddaJsonParseUtil): void {
    data.name = util.getGettextString('name');
    data.nameMultiple = util.getOptionalGettextString('name_multiple');
    data.accusative = util.getGettextString('accusative');
    data.accusativeMultiple = util.getGettextString('accusative_multiple');
    data.heading = util.getGettextString('heading');
    data.headingMultiple = util.getGettextString('heading_multiple');
    data.subBodyParts = util.getArray('sub_parts', new CddaItemRef(), [], jsonTypes.subBodyPart);
  }

  doGetName() {
    return this.data.name.translate();
  }

  doView(data: BodyPartData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });
    if (data.nameMultiple) cardUtil.addField({ label: 'nameMultiple', content: data.nameMultiple });
    cardUtil.addField({ label: 'accusative', content: data.accusative });
    if (data.accusativeMultiple) cardUtil.addField({ label: 'accusativeMultiple', content: data.accusativeMultiple });
    cardUtil.addField({ label: 'heading', content: data.heading });
    cardUtil.addField({ label: 'headingMultiple', content: data.headingMultiple });
    cardUtil.addField({ label: 'subBodyPart', content: data.subBodyParts, separator: ', ' });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }

  doGetRefName() {
    let name = '';
    if (this.data.nameMultiple) name += this.data.nameMultiple.translate() + '/';
    name += this.data.name.translate();
    name += '/' + this.data.accusative.translate();
    if (this.data.accusativeMultiple) name += '/' + this.data.accusativeMultiple.translate();
    name += '/' + this.data.heading.translate();
    if (this.data.headingMultiple) name += '/' + this.data.headingMultiple.translate();

    return name;
  }
}

interface BodyPartData {
  //TODO:miss filed
  name: GettextString;
  nameMultiple?: GettextString;
  accusative: GettextString;
  accusativeMultiple?: GettextString;
  heading: GettextString;
  headingMultiple: GettextString;

  subBodyParts: CddaItemRef[];
}
