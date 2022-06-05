import { i18n } from 'src/boot/i18n';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { MyClass } from 'src/types/EqualClass';
import { Time } from 'src/types/Unit';
import { arrayIsNotEmpty } from 'src/utils/commonUtil';
import { getBoolean, getNumber } from 'src/utils/json/baseJsonUtil';
import { getMyClass, getOptionalMyClass } from 'src/utils/json/dataJsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { Proficiency } from '../other/Proficiency';

export class RecipeProficiency extends MyClass<RecipeProficiency> {
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

  fromJson(jsonObject: object): RecipeProficiency | undefined {
    const result = new RecipeProficiency();

    result.required = getBoolean(jsonObject, 'required');
    result.timeMultiplier = getNumber(jsonObject, 'time_multiplier');
    result.failMultiplier = getNumber(jsonObject, 'fail_multiplier');
    result.learnTimeMultiplier = getNumber(jsonObject, 'learning_time_multiplier', 1);
    result.maxExperience = getOptionalMyClass(jsonObject, 'max_experience', new Time());
    result.name = getMyClass(jsonObject, 'proficiency', new CddaItemRef(), jsonTypes.proficiency);

    if (result.timeMultiplier === 0 || result.failMultiplier === 0) {
      const cddaItems = result.name.getCddaItems();
      if (arrayIsNotEmpty(cddaItems)) {
        const proficiency: Proficiency = (cddaItems[0] as Proficiency) ?? new Proficiency();
        if (!proficiency.finalize) proficiency.doFinalize();
        if (result.timeMultiplier <= 0) {
          result.timeMultiplier = proficiency.data.defaultTimeMultiplier;
        }
        if (result.failMultiplier <= 0) {
          result.failMultiplier = proficiency.data.defaultFailMultiplier;
        }
      }
    }

    return result;
  }

  doView(util: ViewUtil): void {
    if (this.timeMultiplier !== 1) util.addText({ content: `(${this.timeMultiplier}x${i18n.global.t('label.time')})` });
    if (this.failMultiplier !== 1) util.addText({ content: `(${this.failMultiplier}x${i18n.global.t('label.fail')})` });
    if (this.learnTimeMultiplier !== 1)
      util.addText({ content: `(${this.learnTimeMultiplier}x${i18n.global.t('label.learningTime')})` });
    if (this.maxExperience)
      util.addText({ content: `(${this.maxExperience}:${i18n.global.t('label.maxExperience')})` });
    if (this.required) util.addText({ content: `(${i18n.global.t('label.required')})` });
  }
}
