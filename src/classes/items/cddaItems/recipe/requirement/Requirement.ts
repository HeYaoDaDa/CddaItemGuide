import { ColDef, ColGroupDef } from 'ag-grid-community';
import { cloneDeep } from 'lodash';
import { globalI18n } from 'src/boot/i18n';
import { CddaItem } from 'src/classes';
import { CddaItemRef } from 'src/classes/items';
import { isNotEmpty } from 'src/utils';
import CddaJsonParseUtil from 'src/utils/json/CddaJsonParseUtil';
import ViewUtil from 'src/utils/ViewUtil';
import { ItemComponent } from './ItemComponent';
import { RequirementQualitie } from './RequirementQualitie';
import { ToolComponent } from './ToolComponent';

export class Requirement extends CddaItem<RequirementData> {
  doLoadJson(data: RequirementData, util: CddaJsonParseUtil): void {
    data.qualities = util.getArray('qualities', [new RequirementQualitie()]);
    data.tools = util.getArray('tools', [new ToolComponent()]);
    data.components = util.getArray('components', [new ItemComponent()]);
  }

  doFinalize(): void {
    return;
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
}

interface RequirementData {
  qualities: Array<Array<RequirementQualitie>>;
  tools: Array<Array<ToolComponent>>;
  components: Array<Array<ItemComponent>>;
}

export function normalizeRequirmentInterface(
  requirement: Requirement,
  multiplier?: number,
  usings?: { requirment: CddaItemRef; count: number }[]
): Requirement {
  const newRequirement = cloneDeep(requirement);

  const myUsings: Array<{ requirment: CddaItemRef; count: number }> = usings ?? [];

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
          return normalizeRequirmentInterface(requirmentJsonItems[0] as Requirement, using.count);
        }
      } else {
        console.warn('wrong requirement', requirement);
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

  return requirmentMultiplier(newRequirement, multiplier ?? 1);
}

function requirmentMultiplier(requirement: Requirement, multiplier: number) {
  if (multiplier > 1) {
    requirement.data.tools.forEach((tools) => tools.forEach((tool) => (tool.count *= multiplier)));
    requirement.data.components.forEach((components) =>
      components.forEach((component) => (component.count *= multiplier))
    );
  }
  return requirement;
}
