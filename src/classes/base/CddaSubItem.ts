import { isEqual } from 'src/utils';
import ViewUtil from 'src/utils/ViewUtil';
import { VNode } from 'vue';
import EquableInterface from './EquableInterface';
import ViewableInterface from './ViewableInterface';

/**
 * Cdda Sub Item
 */
export abstract class CddaSubItem implements ViewableInterface, EquableInterface {
  /**
   * parse json init object
   * @param jsonObject json object
   * @param extend extend params, optional
   */
  abstract parseJson(jsonObject: unknown, ...extend: unknown[]): this;

  equal(param: unknown): boolean {
    if (param === undefined) return false;
    if (param instanceof this.constructor) return isEqual(this, param);
    else return false;
  }

  view(): VNode[] {
    const util = new ViewUtil();

    this.doView(util);

    return util.result;
  }

  abstract doView(util: ViewUtil): void;
}
