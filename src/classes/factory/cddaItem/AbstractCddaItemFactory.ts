import { CddaItem } from 'src/classes';
import AbstractVersionFactory from '../AbstractVersionFactory';

export abstract class AbstractCddaItemFactory extends AbstractVersionFactory<CddaItem<object>> {}
