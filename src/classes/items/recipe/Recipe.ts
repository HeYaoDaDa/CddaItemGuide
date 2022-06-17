import { ColDef, ColGroupDef } from 'ag-grid-community';
import { myLogger } from 'src/boot/logger';
import { CddaItem, CddaSubItem } from 'src/classes';
import { CddaItemRef, Time } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { getOptionalString, getOptionalUnknown } from 'src/utils/json';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { activityLevelVersionFactory } from './ActivityLevel/ActivityLevelVersionFactory';
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
    data.activity = util.getCddaSubItem('activity_level', activityLevelVersionFactory.getProduct());
    data.neverLearn = util.getBoolean('never_learn');
    data.autolearnRequire = util
      .getArray('autolearn', <[string, number | undefined]>{})
      .map((value) => [CddaItemRef.init(jsonTypes.skill, value[0]), value[1] ?? 0]);
    data.decompLearn = util
      .getArray('decomp_learn', <[string, number | undefined]>{})
      .map((value) => [CddaItemRef.init(jsonTypes.skill, value[0]), value[1] ?? 0]);
    data.bookLearn = parseBookLearn(this.json);
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
    this.data.normalRequirement = this.data.requirement.getNormalizeRequirmentInterface(1, this.data.usings);
  }

  doGetName(): string {
    return this.data.result?.getName() ?? this.id;
  }

  doView(): void {
    return;
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
  bookLearn: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[];

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

export function parseBookLearn(jsonObject: unknown) {
  const bookLearnJson = getOptionalUnknown(jsonObject, 'book_learn') as
    | undefined
    | Record<string, BookLearnJson>
    | [string, number | undefined][];
  const bookLearn: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[] = [];

  if (bookLearnJson !== undefined) {
    if (Array.isArray(bookLearnJson)) {
      bookLearnJson.forEach((bookLearnTuple) =>
        bookLearn.push({
          book: CddaItemRef.init(bookLearnTuple[0], jsonTypes.item),
          level: bookLearnTuple[1] ?? -1,
          name: undefined,
          hidden: false,
        })
      );
    } else {
      for (const bookId in bookLearnJson) {
        const bookLearnObject = bookLearnJson[bookId];

        bookLearn.push({
          book: CddaItemRef.init(bookId, jsonTypes.item),
          level: bookLearnObject.skill_level,
          name: bookLearnObject.recipe_name,
          hidden: bookLearnObject.hidden ?? false,
        });
      }
    }
  }

  return bookLearn;

  interface BookLearnJson {
    skill_level: number;
    recipe_name?: string;
    hidden?: boolean;
  }
}
