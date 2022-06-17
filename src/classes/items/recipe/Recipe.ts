import { ColDef, ColGroupDef } from 'ag-grid-community';
import { myLogger } from 'src/boot/logger';
import { CddaItem, CddaSubItem } from 'src/classes';
import { CddaItemRef, Time } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isNotEmpty } from 'src/utils';
import { getOptionalString } from 'src/utils/json';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';
import { activityLevelVersionFactory } from './ActivityLevel/ActivityLevelVersionFactory';
import { recipeBookLearnVersionFactory } from './RecipeBookLearn/RecipeBookLearnVersionFactory';
import { recipeProficiencyVersionFactory } from './RecipeProficiency/RecipeProficiencyVersionFactory';
import { Requirement } from './requirement/Requirement';

export class Recipe extends CddaItem<RecipeData> {
  parseId(): string[] {
    const result = getOptionalString(this.json, 'result') ?? getOptionalString(this.json, 'copy-from');
    const id_suffix = getOptionalString(this.json, 'id_suffix');
    const abstract = getOptionalString(this.json, 'abstract');
    if (abstract) return [abstract];
    if (result) {
      if (id_suffix) return [result + '_' + id_suffix];
      else return [result];
    }

    myLogger.error(this.json);
    throw new Error('fuck??? what recipe no result, abstract and copy-from');
  }

  doLoadJson(data: RecipeData, util: CddaJsonParseUtil): void {
    data.obsolete = util.getBoolean('obsolete');
    data.result = util.getCddaItemRef('result', jsonTypes.item);
    data.byproducts = util
      .getArray('byproducts', {} as [string, number | undefined])
      .map((value) => [CddaItemRef.init(value[0], jsonTypes.item), value[1] ?? 1]);
    if (data.obsolete) return;
    data.time = util.getTime('time', 0.01);
    data.skillUse = util.getCddaItemRef('skill_used', jsonTypes.skill);
    data.difficulty = util.getNumber('difficulty');
    data.skillRequire = util
      .getArray('skills_required', <[string, number | undefined]>{})
      .map((value) => [CddaItemRef.init(jsonTypes.skill, value[0]), value[1] ?? 0]);
    data.activity = util.getCddaSubItem(
      'activity_level',
      activityLevelVersionFactory.getProduct().parseJson(undefined)
    );
    data.neverLearn = util.getBoolean('never_learn');
    data.autolearnRequire = util
      .getArray('autolearn', <[string, number | undefined]>{})
      .map((value) => [CddaItemRef.init(jsonTypes.skill, value[0]), value[1] ?? 0]);
    data.decompLearn = util
      .getArray('decomp_learn', <[string, number | undefined]>{})
      .map((value) => [CddaItemRef.init(jsonTypes.skill, value[0]), value[1] ?? 0]);
    data.bookLearn = util.getCddaSubItem('book_learn', recipeBookLearnVersionFactory.getProduct());
    data.proficiencies = util.getArray('proficiencies', recipeProficiencyVersionFactory.getProduct());
    data.requirement = new Requirement();
    data.requirement.json = this.json;
    data.requirement.loadJson();
    data.usings = util.getArray('using', <[string, number | undefined]>{}).map((value) => {
      return { requirment: CddaItemRef.init(jsonTypes.requirement, value[0]), count: value[1] ?? 1 };
    });
    data.flags = util.getArray('flags', new CddaItemRef(), [], jsonTypes.flag);
    data.contained = util.getBoolean('contained');
    data.sealed = util.getBoolean('sealed');
    data.container = util.getCddaItemRef('container', jsonTypes.item);
    data.batch = util.getOptionalUnknown('batch_time_factors') as [number, number] | undefined;
    data.charges = util.getNumber('charges');
    data.resultMult = util.getNumber('result_mult');
  }

  doFinalize(): void {
    if (this.data.obsolete) return;
    this.data.normalRequirement = this.data.requirement.getNormalizeRequirmentInterface(1, this.data.usings);
  }

  doGetName(): string {
    return this.data.result?.getName() ?? this.id;
  }

  doView(data: RecipeData, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this });

    if (data.obsolete) {
    } else {
      if (data.result) cardUtil.addField({ label: 'result', content: data.result });
      if (data.resultMult > 1) cardUtil.addField({ label: 'resultMult', content: data.resultMult });
      if (data.charges > 1) cardUtil.addField({ label: 'charges', content: data.charges });
      cardUtil.addField({ label: 'time', content: data.time });
      cardUtil.addField({ label: 'skill', content: `${data.skillUse}(${data.difficulty})` });
      cardUtil.addField({ label: 'otherSkill', content: data.skillRequire.map((item) => `${item[0]}(${item[1]})`) });
      cardUtil.addField({ label: 'activity', content: data.activity });
      if (data.neverLearn) cardUtil.addField({ label: 'neverLearn', content: data.neverLearn });
      if (isNotEmpty(data.autolearnRequire))
        cardUtil.addField({
          label: 'autoLearn',
          content: data.autolearnRequire.map((item) => `${item[0]}(${item[1]})`),
        });
      if (isNotEmpty(data.decompLearn))
        cardUtil.addField({ label: 'decompLearn', content: data.decompLearn.map((item) => `${item[0]}(${item[1]})`) });
      if (isNotEmpty(data.bookLearn)) cardUtil.addField({ label: 'book', content: data.bookLearn });
      if (isNotEmpty(data.proficiencies))
        cardUtil.addField({ label: 'proficiency', content: data.proficiencies, ul: true });
      //TODO:
      cardUtil.result.push(...data.normalRequirement.doCardView(data.normalRequirement.data, new ViewUtil()));
      cardUtil.addField({ label: 'flag', content: data.flags });
      if (data.batch) cardUtil.addField({ label: 'barch', content: `${data.batch[0]}(${data.batch[1]})` });
    }
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}

interface RecipeData {
  result?: CddaItemRef;
  byproducts: [CddaItemRef, number][];
  time: Time;
  skillUse: CddaItemRef;
  difficulty: number;
  skillRequire: [CddaItemRef, number][];

  activity: CddaSubItem;

  neverLearn: boolean;
  autolearnRequire: [CddaItemRef, number][];
  decompLearn: [CddaItemRef, number][];
  bookLearn: CddaSubItem;

  proficiencies: CddaSubItem[];
  requirement: Requirement;
  usings: { requirment: CddaItemRef; count: number }[];
  obsolete: boolean;
  flags: CddaItemRef[];

  //automatically set contained if we specify as container
  contained: boolean;
  sealed: boolean;
  container: CddaItemRef;

  batch?: [number, number];

  charges: number;
  resultMult: number;

  normalRequirement: Requirement;
}
