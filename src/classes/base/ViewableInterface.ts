import { VNode } from 'vue';

/**
 * Viewable Interface
 */
export default interface ViewableInterface {
  /**
   * view current object
   */
  view(): VNode[];
}
