import { VNode } from 'vue';

export class ViewUtil {
  result: VNode[] = [];

  add(v: VNode) {
    this.result.push(v);
  }
}
