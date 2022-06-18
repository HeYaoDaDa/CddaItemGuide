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
import { cddaItemRefWithNumberVersionFactory } from './CddaRefItemWithNumber/CddaItemRefWithNumberVersionFactory';
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
    data.byproducts = util.getArray(
      'byproducts',
      cddaItemRefWithNumberVersionFactory.getProduct(),
      [],
      jsonTypes.item,
      1
    );
    if (data.obsolete) return;
    data.time = util.getTime('time', 0.01);
    data.skillUse = util.getCddaItemRef('skill_used', jsonTypes.skill);
    data.difficulty = util.getNumber('difficulty');

    const rowSkills = util.getOptionalUnknown('skills_required');

    if (rowSkills) {
      if (Array.isArray(rowSkills)) {
        const skillRequires = Array.isArray(rowSkills[0]) ? rowSkills : [rowSkills];

        data.skillRequire = skillRequires.map((autoLearn) =>
          cddaItemRefWithNumberVersionFactory.getProduct().parseJson(autoLearn, jsonTypes.skill, 0)
        );
      } else {
        myLogger.error('skills_required is ', rowSkills);
        throw new Error('assert fail!');
      }
    }

    data.activity = util.getCddaSubItem(
      'activity_level',
      activityLevelVersionFactory.getProduct().parseJson(undefined)
    );
    data.neverLearn = util.getBoolean('never_learn');

    const rowAutoLearns = util.getArray('autolearn', <unknown>{});
    let autoLearns = new Array<unknown>();

    if (isNotEmpty(rowAutoLearns) || rowAutoLearns[0] !== false) {
      autoLearns = rowAutoLearns.map((item) => {
        if (typeof item === 'boolean') return [data.skillUse.id, data.difficulty];
        else if (typeof item === 'number') return [data.skillUse.id, item];
        else return item;
      });
    }

    data.autolearnRequire = autoLearns.map((autoLearn) =>
      cddaItemRefWithNumberVersionFactory.getProduct().parseJson(autoLearn, jsonTypes.skill, 0)
    );

    const rowDecompLearn = util.getArray('autolearn', <unknown>{}) ?? false;
    let decompLearn = new Array<unknown>();

    if (isNotEmpty(rowDecompLearn) || rowDecompLearn[0] !== false) {
      decompLearn = rowDecompLearn.map((item) => {
        if (typeof item === 'boolean') return [data.skillUse.id, data.difficulty];
        else if (typeof item === 'number') return [data.skillUse.id, item];
        else return item;
      });
    }

    data.decompLearn = decompLearn.map((autoLearn) =>
      cddaItemRefWithNumberVersionFactory.getProduct().parseJson(autoLearn, jsonTypes.skill, 0)
    );
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

      const skillView = cardUtil.addField({ label: 'skill' });

      skillView.addText({ content: data.skillUse });
      skillView.addText({ content: `(${data.difficulty})` });
      if (isNotEmpty(data.skillRequire)) cardUtil.addField({ label: 'otherSkill', content: data.skillRequire });
      cardUtil.addField({ label: 'activity', content: data.activity });
      if (data.neverLearn) cardUtil.addField({ label: 'neverLearn', content: data.neverLearn });
      if (isNotEmpty(data.autolearnRequire))
        cardUtil.addField({
          label: 'autoLearn',
          content: data.autolearnRequire,
        });
      if (isNotEmpty(data.decompLearn)) cardUtil.addField({ label: 'decompLearn', content: data.decompLearn });
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
  byproducts: CddaSubItem[];
  time: Time;
  skillUse: CddaItemRef;
  difficulty: number;
  skillRequire: CddaSubItem[];

  activity: CddaSubItem;

  neverLearn: boolean;
  autolearnRequire: CddaSubItem[];
  decompLearn: CddaSubItem[];
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
