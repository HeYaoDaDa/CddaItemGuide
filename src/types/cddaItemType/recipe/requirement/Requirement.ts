import { ColDef, ColGroupDef } from 'ag-grid-community';
import { i18n } from 'src/boot/i18n';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from 'src/types/CddaItem';
import { JsonItem } from 'src/types/JsonItem';
import { arrayIsNotEmpty } from 'src/utils/commonUtil';
import { commonParseId } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { ItemComponent } from './ItemComponent';
import { RequirementQualitie } from './RequirementQualitie';
import { ToolComponent } from './ToolComponent';

export class Requirement extends CddaItem<RequirementData> {
  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.requirement;
  }

  parseId(): string[] {
    return commonParseId(this.json);
  }

  doLoadJson(data: RequirementData, util: JsonParseUtil): void {
    data.qualities = util.getArray('qualities', [new RequirementQualitie()]);
    data.tools = util.getArray('tools', [new ToolComponent()]);
    data.components = util.getArray('components', [new ItemComponent()]);
  }

  doFinalize(): void {
    return;
  }

  getName(): string {
    return this.id;
  }

  doResetSearch(): void {
    return;
  }

  doView(data: RequirementData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });
    if (arrayIsNotEmpty(data.qualities)) {
      const qualityUtil = cardUtil.addField({ label: 'quality', ul: true });
      data.qualities.forEach((qualities) =>
        qualityUtil.addText({ content: qualities, separator: i18n.global.t('base.or') })
      );
    }
    if (arrayIsNotEmpty(data.tools)) {
      const toolUtil = cardUtil.addField({ label: 'tool', ul: true });
      data.tools.forEach((tools) => toolUtil.addText({ content: tools, separator: i18n.global.t('base.or') }));
    }
    if (arrayIsNotEmpty(data.components)) {
      const component = cardUtil.addField({ label: 'component', ul: true });
      data.components.forEach((components) =>
        component.addText({ content: components, separator: i18n.global.t('base.or') })
      );
    }
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}

interface RequirementData {
  qualities: Array<Array<RequirementQualitie>>;
  tools: Array<Array<ToolComponent>>;
  components: Array<Array<ItemComponent>>;
}
