import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes/base/CddaItem';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef, GettextString, Length, Volume, Weight } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { CddaJsonParseUtil } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { toHitVersionFactory } from '../other/ToHit/ToHitVersionFactory';
import { ItemMaterial } from './ItemMaterial/ItemMaterial';

export class BaseItem extends CddaItem<BaseItemInterface> {
  doLoadJson(data: BaseItemInterface, util: CddaJsonParseUtil): void {
    data.name = util.getGettextString('name');
    data.description = util.getGettextString('description');
    data.symbol = util.getString('symbol');
    data.color = util.getString('color');
    data.weight = util.getWeight('weight');
    data.volume = util.getVolume('volume');
    data.longestSide = util.getLength('longest_side', Math.round(Math.cbrt(data.volume.value)));
    data.baseMovesPerAttack = this.calcBaseMovesPerAttack(data.volume.value, data.weight.value);
    data.bash = util.getNumber('bashing');
    data.cut = util.getNumber('cutting');
    data.toHit = util.getCddaSubItem('to_hit', toHitVersionFactory.getProduct());
    data.category = util.getOptionalCddaItemRef('category', jsonTypes.itemCategory) ?? this.calcCategory();
    data.flags = util.getArray('flags', new CddaItemRef(), [], jsonTypes.subBodyPart);
    data.weaponCategory = util.getArray('weapon_category', new CddaItemRef(), [], jsonTypes.subBodyPart);
    data.techniques = util.getArray('techniques', new CddaItemRef(), [], jsonTypes.subBodyPart);
    data.materials = util.getArray('material', new ItemMaterial());
  }

  doFinalize(): void {
    this.weight = 100;
    this.isSearch = true;
    this.data.materialPortionsTotal = 0;
    this.data.materials.forEach((material) => (this.data.materialPortionsTotal += material.portion));
  }

  doGetName(): string | undefined {
    return this.data.name.translate();
  }

  doGetDescription(): string | undefined {
    return this.data.description.translate();
  }

  doView(data: BaseItemInterface, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this, symbol: this.data.symbol, color: this.data.color });

    cardUtil.addField({ label: 'material', content: data.materials });
    cardUtil.addField({ label: 'weight', content: data.weight });
    cardUtil.addField({ label: 'volume', content: data.volume });
    cardUtil.addField({ label: 'length', content: data.longestSide });
    cardUtil.addField({ label: 'category', content: data.category });
    cardUtil.addField({ label: 'flag', content: data.flags });
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }

  private calcBaseMovesPerAttack(volume: number, weight: number): number {
    return 65 + Math.floor(volume / 62.5) + Math.floor(weight / 60);
  }

  private calcCategory(): CddaItemRef {
    return CddaItemRef.init('other', jsonTypes.itemCategory);
  }
}

interface BaseItemInterface {
  name: GettextString;
  description: GettextString;
  symbol: string;
  color: string;

  materials: ItemMaterial[];
  materialPortionsTotal: number;

  weight: Weight;
  volume: Volume;
  longestSide: Length;

  category: CddaItemRef;

  flags: CddaItemRef[];

  //melee
  bash: number;
  cut: number;
  toHit: CddaSubItem;
  baseMovesPerAttack: number;
  weaponCategory: CddaItemRef[];
  techniques: CddaItemRef[];
}
