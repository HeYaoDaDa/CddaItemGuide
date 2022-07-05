import { CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/items/base/AbstractCddaSubItemFactory';
import { PocketNoise } from './PocketNoise';

class PocketNoiseVersionFactory extends AbstractCddaSubItemVersionFactory {
  doGetProduct(): CddaSubItem {
    return new PocketNoise();
  }
}

export const pocketNoiseVersionFactory = new PocketNoiseVersionFactory();
