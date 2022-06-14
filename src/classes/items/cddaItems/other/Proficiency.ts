import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes';
import { CddaItemRef, GettextString, Time } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';

export class Proficiency extends CddaItem<ProficiencyData> {
  doLoadJson(data: ProficiencyData, util: CddaJsonParseUtil): void {
    data.name = util.getGettextString('name');
    data.description = util.getGettextString('description');
    data.canLearn = util.getBoolean('can_learn');
    data.ignoreFocus = util.getBoolean('ignore_focus');
    data.defaultTimeMultiplier = util.getNumber('default_time_multiplier', 2);
    data.defaultFailMultiplier = util.getNumber('default_fail_multiplier', 2);
    data.defaultWeakpointBonus = util.getNumber('default_weakpoint_bonus');
    data.defaultWeakpointPenalty = util.getNumber('default_weakpoint_penalty');
    data.learnTime = util.getTime('time_to_learn', undefined, Time.init(9999 * 60 * 60));
    data.required = util.getArray('required_proficiencies', new CddaItemRef(), [], jsonTypes.proficiency);
  }

  doFinalize(): void {
    return;
  }

  doGetName(): string {
    return this.data.name.translate();
  }

  doResetDescription(): void {
    this.description = this.data.description.translate();
  }

  doView(data: ProficiencyData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });

    cardUtil.addField({ label: 'canLearn', content: data.canLearn });
    cardUtil.addField({ label: 'ignoreFocus', content: data.ignoreFocus });
    cardUtil.addField({ label: 'defaultTimeMultiplier', content: data.defaultTimeMultiplier });
    cardUtil.addField({ label: 'defaultFailMultiplier', content: data.defaultFailMultiplier });
    cardUtil.addField({ label: 'defaultWeakpointBonus', content: data.defaultWeakpointBonus });
    cardUtil.addField({ label: 'defaultWeakpointPenalty', content: data.defaultWeakpointPenalty });
    cardUtil.addField({ label: 'learnTime', content: data.learnTime });
    cardUtil.addField({ label: 'required', content: data.required, separator: ', ' });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}

interface ProficiencyData {
  name: GettextString;
  description: GettextString;

  canLearn: boolean;
  ignoreFocus: boolean;

  defaultTimeMultiplier: number;
  defaultFailMultiplier: number;

  defaultWeakpointBonus: number;
  defaultWeakpointPenalty: number;

  learnTime: Time;
  required: CddaItemRef[];

  //miss bonuses
}
