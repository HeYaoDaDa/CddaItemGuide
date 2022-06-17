import { CddaItem } from 'src/classes/base/CddaItem';
import { AbstractCddaItemVersionFactory } from '../base/AbstractCddaItemVersionFactory';
import { Recipe } from './Recipe';

class RecipeVersionFactory extends AbstractCddaItemVersionFactory {
  doGetProduct(): CddaItem<object> {
    return new Recipe();
  }
}

export const recipeVersionFactory = new RecipeVersionFactory();
