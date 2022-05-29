import { ColDef, ColGroupDef } from 'ag-grid-community';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from 'src/types/CddaItem';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { GettextString } from 'src/types/GettextString';
import { JsonItem } from 'src/types/JsonItem';
import { commonParseId } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class BodyPart extends CddaItem<BodyPartData> {
  data = {} as BodyPartData;

  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.bodyPart;
  }

  parseId(): string[] {
    return commonParseId(this.json);
  }

  doLoadJson(data: BodyPartData, util: JsonParseUtil): void {
    data.name = util.getMyClass('name', new GettextString());
    data.nameMultiple = util.getOptionalMyClass('name_multiple', new GettextString());
    data.accusative = util.getMyClass('accusative', new GettextString());
    data.accusativeMultiple = util.getOptionalMyClass('accusative_multiple', new GettextString());
    data.heading = util.getMyClass('heading', new GettextString());
    data.headingMultiple = util.getMyClass('heading_multiple', new GettextString());
    data.subBodyParts = util.getArray('sub_parts', new CddaItemRef(), [], jsonTypes.subBodyPart);
  }

  doFinalize(): void {
    return;
  }

  getName(): string {
    let name = '';
    if (this.data.nameMultiple) name += this.data.nameMultiple.translate() + '/';
    name += this.data.name.translate();
    name += '/' + this.data.accusative.translate();
    if (this.data.accusativeMultiple) name += '/' + this.data.accusativeMultiple.translate();
    name += '/' + this.data.heading.translate();
    if (this.data.headingMultiple) name += '/' + this.data.headingMultiple.translate();
    return name;
  }

  doResetSearch(): void {
    return;
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
