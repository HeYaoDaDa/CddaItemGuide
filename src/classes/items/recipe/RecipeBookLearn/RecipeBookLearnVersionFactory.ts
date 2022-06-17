import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { RecipeBookLearn } from './RecipeBookLearn';

class RecipeBookLearnVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct() {
    return new RecipeBookLearn();
  }
}

export const recipeBookLearnVersionFactory = new RecipeBookLearnVersionFactory();
