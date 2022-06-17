import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { ViewUtil } from 'src/utils/ViewUtil';
import { h } from 'vue';
import { CddaItemRef } from '../../base/CddaItemRef';

export class RecipeBookLearn extends CddaSubItem {
  value!: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[];

  parseJson(jsonObject: unknown): this {
    const bookLearnJson = jsonObject as undefined | Record<string, BookLearnJson> | [string, number | undefined][];

    this.value = [];

    if (bookLearnJson !== undefined) {
      if (Array.isArray(bookLearnJson)) {
        bookLearnJson.forEach((bookLearnTuple) =>
          this.value.push({
            book: CddaItemRef.init(bookLearnTuple[0], jsonTypes.item),
            level: bookLearnTuple[1] ?? -1,
            name: undefined,
            hidden: false,
          })
        );
      } else {
        for (const bookId in bookLearnJson) {
          const bookLearnObject = bookLearnJson[bookId];

          this.value.push({
            book: CddaItemRef.init(bookId, jsonTypes.item),
            level: bookLearnObject.skill_level,
            name: bookLearnObject.recipe_name,
            hidden: bookLearnObject.hidden ?? false,
          });
        }
      }
    }

    return this;

    interface BookLearnJson {
      skill_level: number;
      recipe_name?: string;
      hidden?: boolean;
    }
  }

  doView(util: ViewUtil): void {
    const itemUtils = new Array<ViewUtil>();

    this.value.forEach((book) => {
      const subUtil = new ViewUtil();

      subUtil.addField({ label: 'book', content: book.book });
      subUtil.addField({ label: 'level', content: book.level });
      if (book.hidden) subUtil.addField({ label: 'hidden', content: book.hidden });
      if (book.name) subUtil.addField({ label: 'name', content: book.name });
      itemUtils.push(subUtil);
    });
    util.add(
      h(
        'ul',
        itemUtils.map((subUtil) => h('li', subUtil.result))
      )
    );
  }
}
