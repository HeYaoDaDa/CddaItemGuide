import { ColDef, ColGroupDef } from 'ag-grid-community';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaItem } from 'src/types/CddaItem';
import { CddaItemRef } from 'src/types/CddaItemRef';
import { JsonItem } from 'src/types/JsonItem';
import { Time } from 'src/types/Unit';
import { getOptionalString, getOptionalUnknown } from 'src/utils/json/baseJsonUtil';
import { JsonParseUtil } from 'src/utils/json/jsonUtil';
import { ViewUtil } from 'src/utils/viewUtil';
import { ActivityLevel } from './ActivityLevel';
import { RecipeProficiency } from './RecipeProficiency';
import { normalizeRequirmentInterface, Requirement } from './requirement/Requirement';

export class Recipe extends CddaItem<RecipeData> {
  validate(jsonItem: JsonItem): boolean {
    return jsonTypes.recipe === jsonItem.jsonType;
  }

  parseId(): string[] {
    const result = getOptionalString(this.json, 'result');
    const id_suffix = getOptionalString(this.json, 'id_suffix');
    const abstract = getOptionalString(this.json, 'abstract');
    if (abstract) return [abstract];
    if (result) {
      if (id_suffix) return [result + '_' + id_suffix];
      else return [result];
    }
    throw new Error('fuck??? what recipe no result and abstract');
  }

  doLoadJson(data: RecipeData, util: JsonParseUtil): void {
    data.obsolete = util.getBoolean('obsolete');
    data.result = util.getOptionalMyClass('result', new CddaItemRef(), jsonTypes.item);
    data.byproducts = util
      .getArray('byproducts', {} as [string, number | undefined])
      .map((value) => [new CddaItemRef({ id: value[0], type: jsonTypes.item }), value[1] ?? 1]);
    if (data.obsolete) return;
    data.time = util.getMyClass('time', new Time(), 0.01);
    data.skillUse = util.getMyClass('skill_used', new CddaItemRef(), jsonTypes.skill);
    data.difficulty = util.getNumber('difficulty');
    data.skillRequire = util
      .getArray('skills_required', <[string, number | undefined]>{})
      .map((value) => [new CddaItemRef({ type: jsonTypes.skill, id: value[0] }), value[1] ?? 0]);
    data.activity = util.getMyClass('activity_level', new ActivityLevel());
    data.neverLearn = util.getBoolean('never_learn');
    data.autolearnRequire = util
      .getArray('autolearn', <[string, number | undefined]>{})
      .map((value) => [new CddaItemRef({ type: jsonTypes.skill, id: value[0] }), value[1] ?? 0]);
    data.decompLearn = util
      .getArray('decomp_learn', <[string, number | undefined]>{})
      .map((value) => [new CddaItemRef({ type: jsonTypes.skill, id: value[0] }), value[1] ?? 0]);
    data.bookLearn = parseBookLearn(this.json);

    data.proficiencies = util.getArray('proficiencies', new RecipeProficiency());
    data.requirement = new Requirement();
    data.requirement.json = this.json;
    data.requirement.loadJson();

    data.usings = util.getArray('using', <[string, number | undefined]>{}).map((value) => {
      return { requirment: new CddaItemRef({ type: jsonTypes.requirement, id: value[0] }), count: value[1] ?? 1 };
    });
    data.flags = util.getArray('flags', new CddaItemRef(), [], jsonTypes.flag);

    data.contained = util.getBoolean('contained');
    data.sealed = util.getBoolean('sealed');
    data.container = util.getMyClass('container', new CddaItemRef(), jsonTypes.item);
    data.batch = util.getOptionalUnknown('batch_time_factors') as [number, number] | undefined;
    data.charges = util.getNumber('charges');
    data.resultMult = util.getNumber('result_mult');
  }

  doFinalize(): void {
    this.data.normalRequirement = normalizeRequirmentInterface(this.data.requirement, 1, this.data.usings);
  }

  getName(): string {
    throw this.id;
  }

  doResetSearch(): void {
    return;
  }

  doView(data: RecipeData, util: ViewUtil): void {
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

  activity: ActivityLevel;

  neverLearn: boolean;
  autolearnRequire: [CddaItemRef, number][];
  decompLearn: [CddaItemRef, number][];
  bookLearn: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[];

  proficiencies: RecipeProficiency[];
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
          book: new CddaItemRef({ id: bookLearnTuple[0], type: jsonTypes.item }),
          level: bookLearnTuple[1] ?? -1,
          name: undefined,
          hidden: false,
        })
      );
    } else {
      for (const bookId in bookLearnJson) {
        const bookLearnObject = bookLearnJson[bookId];
        bookLearn.push({
          book: new CddaItemRef({ id: bookId, type: jsonTypes.item }),
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
