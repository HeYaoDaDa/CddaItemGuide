import { ViewUtil } from 'src/utils/viewUtil';
import { VNode } from 'vue';

export abstract class MyClass<T extends MyClass<T>> {
  view(): VNode[] {
    const util = new ViewUtil();
    this.doView(util);
    return util.result;
  }
  abstract equal(v: object): boolean;
  abstract fromJson(jsonObject: unknown, ...extend: unknown[]): T | undefined;
  abstract doView(util: ViewUtil): void;
}
