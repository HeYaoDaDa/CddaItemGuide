import { AbstractCddaSubItemVersionFactory } from '../../base/AbstractCddaSubItemFactory';
import { RecipeProficiency } from './RecipeProficiency';

class RecipeProficiencyVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct() {
    return new RecipeProficiency();
  }
}

export const recipeProficiencyVersionFactory = new RecipeProficiencyVersionFactory();
