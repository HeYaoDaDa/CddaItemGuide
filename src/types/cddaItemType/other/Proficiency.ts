import { ColDef, ColGroupDef } from 'ag-grid-community';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from 'src/types/CddaItem';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { GettextString } from 'src/types/GettextString';
import { JsonItem } from 'src/types/JsonItem';
import { Time } from 'src/types/Unit';
import { commonParseId } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';

export class Proficiency extends CddaItem<ProficiencyData> {
  validate(jsonItem: JsonItem): boolean {
    return jsonItem.jsonType === jsonTypes.proficiency;
  }

  parseId(): string[] {
    return commonParseId(this.json);
  }

  doLoadJson(data: ProficiencyData, util: JsonParseUtil): void {
    data.name = util.getMyClass<GettextString>('name', new GettextString());
    data.description = util.getMyClass<GettextString>('description', new GettextString());
    data.canLearn = util.getBoolean('');
    data.canLearn = util.getBoolean('can_learn');
    data.ignoreFocus = util.getBoolean('ignore_focus');

    data.defaultTimeMultiplier = util.getNumber('default_time_multiplier', 2);
    data.defaultFailMultiplier = util.getNumber('default_fail_multiplier', 2);

    data.defaultWeakpointBonus = util.getNumber('default_weakpoint_bonus');
    data.defaultWeakpointPenalty = util.getNumber('default_weakpoint_penalty');

    data.learnTime = util.getMyClass('time_to_learn', new Time(9999 * 60 * 60));
    data.required = util.getArray('required_proficiencies', new CddaItemRef(), [], jsonTypes.proficiency);
  }

  doFinalize(): void {
    return;
  }

  getName(): string {
    return this.data.name.translate();
  }

  doResetSearch(): void {
    this.description = this.data.description.translate();
    return;
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
    cardUtil.addField({ label: 'required', content: data.required });
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
