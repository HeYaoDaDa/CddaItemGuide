import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes/base/CddaItem';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef, GettextString, Length, Volume, Weight } from 'src/classes/items';
import { Flag } from 'src/constants/flag';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isNotEmpty } from 'src/utils';
import { CddaJsonParseUtil } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { h } from 'vue';
import { toHitVersionFactory } from '../other/ToHit/ToHitVersionFactory';
import { Armor } from './Armor/Armor';
import { ItemMaterial } from './ItemMaterial/ItemMaterial';
import { Pocket } from './Pocket/Pocket';
import CddaSubItemView from 'src/components/base/CddaSubItemView.vue';

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
    data.pockets = util.getArray('pocket_data', new Pocket());

    if (this.jsonType === jsonTypes.armor) {
      data.armor = new Armor().parseJson(this.json, this);
    } else {
      data.armor = util.getOptionalCddaSubItem('armor_data', new Armor(), this);
    }
  }

  doFinalize(): void {
    this.weight = 100;
    this.isSearch = true;
    this.data.materialPortionsTotal = 0;
    this.data.materials.forEach((material) => (this.data.materialPortionsTotal += material.portion));
    this.data.armor?.finalize();
  }

  doGetName(): string | undefined {
    return this.data.name.translate();
  }

  doGetDescription(): string | undefined {
    return this.data.description.translate();
  }

  doView(data: BaseItemInterface, util: ViewUtil): void {
    const baseItemCardUtil = util.addCard({ cddaItem: this, symbol: this.data.symbol, color: this.data.color });
    const meleeCardUtil = util.addCard({ label: 'Melee' });

    baseItemCardUtil.addField({ label: 'material', content: data.materials });
    baseItemCardUtil.addField({ label: 'weight', content: data.weight });
    baseItemCardUtil.addField({ label: 'volume', content: data.volume });
    baseItemCardUtil.addField({ label: 'length', content: data.longestSide });
    baseItemCardUtil.addField({ label: 'category', content: data.category });
    baseItemCardUtil.addField({ label: 'flag', content: data.flags });
    meleeCardUtil.addField({ label: 'bash', content: data.bash });
    meleeCardUtil.addField({ label: this.isStab() ? 'stab' : 'cut', content: data.cut });
    meleeCardUtil.addField({ label: 'toHit', content: data.toHit });
    meleeCardUtil.addField({ label: 'baseMovesPerAttack', content: data.baseMovesPerAttack });
    if (isNotEmpty(data.weaponCategory))
      meleeCardUtil.addField({ label: 'weaponCategory', content: data.weaponCategory });
    if (isNotEmpty(data.techniques)) meleeCardUtil.addField({ label: 'technique', content: data.techniques });
    if (isNotEmpty(data.pockets)) {
      const pocketCardUtil = util.addCard({ label: 'Pocket' });

      pocketCardUtil.addField({ label: 'pocket', content: data.pockets, dl: true });
    }

    if (data.armor) {
      const armorCardUtil = util.addCard({ label: 'armor' });

      armorCardUtil.add(h(CddaSubItemView, { cddaSubItem: data.armor }));
    }
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

  public hasFlag(flag: Flag) {
    return this.data.flags.some((myflag) => myflag.id === flag);
  }

  private isStab() {
    return this.hasFlag(Flag.SPEAR) || this.hasFlag(Flag.STAB);
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

  pockets: Pocket[];
  armor?: Armor;
}
