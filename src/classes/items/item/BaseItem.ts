import { ColGroupDef, ColDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes/base/CddaItem';
import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef, GettextString, Length, Volume, Weight } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isNotEmpty } from 'src/utils';
import { CddaJsonParseUtil } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { toHitVersionFactory } from '../other/ToHit/ToHitVersionFactory';
import MegerVNodes from 'src/components/base/MegerVNodes.vue';

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
    data.materials = [];
    data.materialPortionsTotal = 0;
    util.getArray('material', {} as unknown).forEach((temp) => {
      let portion = 1;

      if (typeof temp === 'string') {
        data.materials.push([CddaItemRef.init(temp, jsonTypes.material), 1]);
      } else {
        const material = temp as { type: string; portion?: number };

        data.materials.push([CddaItemRef.init(material.type, jsonTypes.material), material.portion ?? 1]);
        portion = material.portion ?? 1;
      }

      data.materialPortionsTotal += portion;
    });
  }

  doGetName(): string | undefined {
    return this.data.name.translate();
  }

  doGetDescription(): string | undefined {
    return this.data.description.translate();
  }

  doView(data: BaseItemInterface, util: ViewUtil): void {
    const cardUtil = util.addCard({ cddaItem: this, symbol: this.data.symbol, color: this.data.color });
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

  materials: [CddaItemRef, number][];
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
