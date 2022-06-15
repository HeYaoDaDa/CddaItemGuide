import { CddaItem } from 'src/classes';
import { AbstractVersionFactory } from './AbstractVersionFactory';

export abstract class AbstractCddaItemVersionFactory extends AbstractVersionFactory<CddaItem<object>> {}
