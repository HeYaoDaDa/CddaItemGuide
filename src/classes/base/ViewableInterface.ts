import { VNode } from 'vue';

/**
 * Viewable Interface
 */
export interface ViewableInterface {
  /**
   * view current object
   */
  view(): VNode[];
}
