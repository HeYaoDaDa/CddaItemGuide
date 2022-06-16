import { ColDef, ColGroupDef } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { globalI18n } from 'src/boot/i18n';
import { CddaItem, CddaSubItem } from 'src/classes';
import { CddaItemRef } from 'src/classes/items';
import { isNotEmpty } from 'src/utils';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';
import { ItemComponent } from './ItemComponent';
import { requirementQualitieVersionFactory } from './requirementQualitie/RequirementQualitieVersionFactory';
import { ToolComponent } from './ToolComponent';

export class Requirement extends CddaItem<RequirementData> {
  doLoadJson(data: RequirementData, util: CddaJsonParseUtil): void {
    data.qualities = util.getArray('qualities', [requirementQualitieVersionFactory.getProduct()]);
    data.tools = util.getArray('tools', [new ToolComponent()]);
    data.components = util.getArray('components', [new ItemComponent()]);
  }

  doGetName(): string {
    return this.id;
  }

  doView(data: RequirementData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });

    if (isNotEmpty(data.qualities)) {
      const qualityUtil = cardUtil.addField({ label: 'quality', ul: true });

      data.qualities.forEach((qualities) =>
        qualityUtil.addText({ content: qualities, separator: globalI18n.global.t('base.or') })
      );
    }

    if (isNotEmpty(data.tools)) {
      const toolUtil = cardUtil.addField({ label: 'tool', ul: true });

      data.tools.forEach((tools) => toolUtil.addText({ content: tools, separator: globalI18n.global.t('base.or') }));
    }

    if (isNotEmpty(data.components)) {
      const component = cardUtil.addField({ label: 'component', ul: true });

      data.components.forEach((components) =>
        component.addText({ content: components, separator: globalI18n.global.t('base.or') })
      );
    }
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }

  getNormalizeRequirmentInterface(
    multiplier?: number,
    usings?: { requirment: CddaItemRef; count: number }[]
  ): Requirement {
    const newRequirement = cloneDeep(this);
    const myUsings: Array<{ requirment: CddaItemRef; count: number }> = usings ?? [];
    const normalizeMultiplier = multiplier ?? 1;

    [newRequirement.data.tools, newRequirement.data.components].forEach((componentListList) => {
      componentListList.forEach((components) =>
        components.splice(
          0,
          components.length,
          ...components.filter((component) => {
            if (component.requirement) {
              myUsings.push({ requirment: component.name, count: component.count });

              return false;
            } else {
              return true;
            }
          })
        )
      );
      componentListList.splice(0, componentListList.length, ...componentListList.filter((tools) => isNotEmpty(tools)));
    });

    if (isNotEmpty(myUsings)) {
      const usingRequirments = myUsings.map((using) => {
        if (using.requirment !== undefined) {
          const requirmentJsonItems = using.requirment.getCddaItems();

          if (isNotEmpty(requirmentJsonItems)) {
            return (requirmentJsonItems[0] as Requirement).getNormalizeRequirmentInterface(using.count);
          }
        } else {
          console.warn('wrong requirement', this);
        }

        return undefined;
      });

      usingRequirments.forEach((usingRequirment) => {
        if (usingRequirment) {
          usingRequirment.data.tools.forEach((tools) => newRequirement.data.tools.push(tools));
          usingRequirment.data.components.forEach((components) => newRequirement.data.components.push(components));
        }
      });
    }

    if (normalizeMultiplier > 1) {
      newRequirement.data.tools.forEach((tools) => tools.forEach((tool) => (tool.count *= normalizeMultiplier)));
      newRequirement.data.components.forEach((components) =>
        components.forEach((component) => (component.count *= normalizeMultiplier))
      );
    }

    return newRequirement;
  }
}

interface RequirementData {
  qualities: Array<Array<CddaSubItem>>;
  tools: Array<Array<ToolComponent>>;
  components: Array<Array<ItemComponent>>;
}
