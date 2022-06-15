import { globalI18n } from 'src/boot/i18n';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef, Time } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isNotEmpty } from 'src/utils';
import { getBoolean, getNumber } from 'src/utils/json';
import { getCddaItemRef, getTime } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/ViewUtil';
import { Proficiency } from '../other/Proficiency/Proficiency';

export class RecipeProficiency extends CddaSubItem {
  name!: CddaItemRef;

  required!: boolean;

  timeMultiplier!: number;
  failMultiplier!: number;
  learnTimeMultiplier!: number;

  maxExperience?: Time;

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (v instanceof RecipeProficiency) return this.name.equal(v.name);
    else return false;
  }

  parseJson(jsonObject: object) {
    this.required = getBoolean(jsonObject, 'required');
    this.timeMultiplier = getNumber(jsonObject, 'time_multiplier');
    this.failMultiplier = getNumber(jsonObject, 'fail_multiplier');
    this.learnTimeMultiplier = getNumber(jsonObject, 'learning_time_multiplier', 1);
    this.maxExperience = getTime(jsonObject, 'max_experience');
    this.name = getCddaItemRef(jsonObject, 'proficiency', jsonTypes.proficiency);

    if (this.timeMultiplier === 0 || this.failMultiplier === 0) {
      const cddaItems = this.name.getCddaItems();

      //FIXME:what???
      if (isNotEmpty(cddaItems)) {
        const proficiency: Proficiency = (cddaItems[0] as Proficiency) ?? new Proficiency();
        if (!proficiency.finalized) proficiency.loadJson();
        if (this.timeMultiplier <= 0) {
          this.timeMultiplier = proficiency.data.defaultTimeMultiplier;
        }

        if (this.failMultiplier <= 0) {
          this.failMultiplier = proficiency.data.defaultFailMultiplier;
        }
      }
    }

    return this;
  }

  doView(util: ViewUtil): void {
    if (this.timeMultiplier !== 1)
      util.addText({ content: `(${this.timeMultiplier}x${globalI18n.global.t('label.time')})` });
    if (this.failMultiplier !== 1)
      util.addText({ content: `(${this.failMultiplier}x${globalI18n.global.t('label.fail')})` });
    if (this.learnTimeMultiplier !== 1)
      util.addText({ content: `(${this.learnTimeMultiplier}x${globalI18n.global.t('label.learningTime')})` });
    if (this.maxExperience)
      util.addText({ content: `(${this.maxExperience}:${globalI18n.global.t('label.maxExperience')})` });
    if (this.required) util.addText({ content: `(${globalI18n.global.t('label.required')})` });
  }
}
