import { cloneDeep } from 'lodash';
import { CddaSubItem } from 'src/classes';
import { CddaItemRef } from 'src/classes/items';
import { BodyPart } from 'src/classes/items/bodyPart/BodyPart/BodyPart';
import { SubBodyPart } from 'src/classes/items/bodyPart/SubBodyPart/SubBodyPart';
import { Material } from 'src/classes/items/material/Material/Material';
import { isNotEmpty } from 'src/utils';
import { ViewUtil } from 'src/utils/ViewUtil';
import { ArmorMaterial } from '../ArmorMaterial/ArmorMaterial';
import { ArmorPortion } from '../ArmorPortion/ArmorPortion';
import ArmorResistFiled from 'src/components/cddaItems/ArmorResistFiled.vue';
import { h } from 'vue';

export class ArmorResist extends CddaSubItem {
  armorResists!: ArmorResistInterface[][];

  parseJson(jsonObject: unknown, subArmorPortions: ArmorPortion[], env: number): this {
    this.armorResists = computeArmorResists(subArmorPortions, env);

    return this;
  }

  doView(util: ViewUtil): void {
    util.add(h(ArmorResistFiled, { data: this }));
  }
}

export interface ArmorResistInterface {
  coverage: number;
  probability: number;
  formatCovers: [CddaItemRef, CddaItemRef[]][];
  coversSubBodyPart: CddaItemRef[];

  bashResist: number;
  cutResist: number;
  stabResist: number;
  bulletResist: number;

  acidResist: number;
  fireResist: number;
  encumber: number;
  maxEncumber?: number;
  envResist: number;
  envFilterResist: number;
}

function computeArmorResists(subArmorPortions: ArmorPortion[], env: number) {
  const armorResists: ArmorResistInterface[][] = [];

  subArmorPortions.forEach((subArmorPortion) => {
    const subArmorPortionResist = getSubBodyPartArmorResist(subArmorPortion, env);

    armorResists.push(mergalArmorResist(subArmorPortionResist));
  });
  mergalArmorResistCover(armorResists);

  return armorResists;
}

function mergalArmorResistCover(armorResists: ArmorResistInterface[][]) {
  armorResists.forEach((resists) => {
    resists.forEach((resist) => {
      resist.formatCovers = [];

      const allResults = resist.coversSubBodyPart.map((subBodyPartName) => {
        const cddaItems = subBodyPartName.getCddaItems();

        return <[CddaItemRef, SubBodyPart]>[subBodyPartName, cddaItems[0]];
      });
      const subBodyParts = new Array<[CddaItemRef, SubBodyPart]>();
      const parents = new Array<CddaItemRef>();

      allResults.forEach((allResult) => {
        subBodyParts.push(allResult);

        if (!parents.find((parent) => parent.id === allResult[1].data.parent.id)) {
          parents.push(allResult[1].data.parent);
        }
      });

      const allResults1 = parents.map((parent) => {
        const cddaItems = parent.getCddaItems();

        return <[CddaItemRef, BodyPart]>[parent, cddaItems[0]];
      });
      const bodyParts = new Array<[CddaItemRef, BodyPart]>();

      allResults1.forEach((allResult) => {
        bodyParts.push(allResult);
      });
      bodyParts.forEach((bodyPart) => {
        const currentSubBodyParts = subBodyParts.filter(
          (subBodyPart) => subBodyPart[1].data.parent.id === bodyPart[0].id
        );

        resist.formatCovers.push([
          bodyPart[0],
          currentSubBodyParts.length === bodyPart[1].data.subBodyParts.length
            ? []
            : currentSubBodyParts.map((curSubBodyPart) => curSubBodyPart[0]),
        ]);
      });
    });
  });
}

function mergalArmorResist(armorResists: ArmorResistInterface[]) {
  const result = new Array<ArmorResistInterface>();

  armorResists.forEach((armorResist) => {
    let found = false;

    result.forEach((resultArmorResist) => {
      if (equalArmorResist(resultArmorResist, armorResist)) {
        found = true;
        // add cover
        armorResist.coversSubBodyPart.forEach((newCover) => {
          if (!resultArmorResist.coversSubBodyPart.find((cover) => cover.id === newCover.id)) {
            resultArmorResist.coversSubBodyPart.push(newCover);
          }
        });
        //add probability
        resultArmorResist.probability += armorResist.probability;
      }
    });

    if (!found) {
      result.push(armorResist);
    }
  });

  return result;
}

function equalArmorResist(l: ArmorResistInterface, r: ArmorResistInterface): boolean {
  return (
    l.coverage === r.coverage &&
    l.probability === r.probability &&
    l.bashResist === r.bashResist &&
    l.cutResist === r.cutResist &&
    l.stabResist === r.stabResist &&
    l.bulletResist === r.bulletResist &&
    l.acidResist === r.acidResist &&
    l.fireResist === r.fireResist &&
    l.encumber === r.encumber &&
    l.maxEncumber === r.maxEncumber &&
    l.envResist === r.envResist &&
    l.envFilterResist === r.envFilterResist
  );
}

function getSubBodyPartArmorResist(
  armorPortion: ArmorPortion,
  avgEnvironmentalProtection: number
): ArmorResistInterface[] {
  const armorMaterialObjects = armorPortion.armorMaterials.map((armorMaterial) => {
    const cddaItems = armorMaterial.id.getCddaItems();

    if (isNotEmpty(cddaItems)) {
      const material = cddaItems[0] as Material;

      return <[Material, ArmorMaterial]>[material, armorMaterial];
    }

    return <[Material, ArmorMaterial]>[new Material(), armorMaterial];
  });
  let result = new Array<ArmorResistInterface>({
    coverage: armorPortion.coverage,
    probability: 100,
    formatCovers: [],
    coversSubBodyPart: armorPortion.coversSubBodyPart,
    bashResist: 0,
    cutResist: 0,
    stabResist: 0,
    bulletResist: 0,
    acidResist: 0,
    fireResist: 0,
    encumber: armorPortion.encumber,
    maxEncumber: armorPortion.maxEncumber,
    envResist: armorPortion.environmentalProtection,
    envFilterResist: armorPortion.environmentalProtectionWithFilter,
  });

  armorMaterialObjects.forEach((item) => {
    const armorMaterialObject = item[0];
    const armorMaterial = item[1];
    const newResult = new Array<ArmorResistInterface>();

    result.forEach((resultItem) => {
      const hitArmorResist = {} as ArmorResistInterface;

      hitArmorResist.coverage = resultItem.coverage;
      hitArmorResist.probability = resultItem.probability * armorMaterial.coverage * 0.01;
      hitArmorResist.coversSubBodyPart = armorPortion.coversSubBodyPart;
      hitArmorResist.bashResist = resultItem.bashResist + armorMaterialObject.data.bashResist * armorMaterial.thickness;
      hitArmorResist.cutResist = resultItem.cutResist + armorMaterialObject.data.cutResist * armorMaterial.thickness;
      // stab resist is cut's 80%
      hitArmorResist.stabResist =
        resultItem.stabResist + armorMaterialObject.data.cutResist * 0.8 * armorMaterial.thickness;
      hitArmorResist.bulletResist =
        resultItem.bulletResist + armorMaterialObject.data.bulletResist * armorMaterial.thickness;
      hitArmorResist.acidResist = armorMaterialObject.data.acidResist * armorMaterial.coverage * 0.01;
      hitArmorResist.fireResist = armorMaterialObject.data.fireResist * armorMaterial.coverage * 0.01;

      if (avgEnvironmentalProtection < 10) {
        hitArmorResist.acidResist *= avgEnvironmentalProtection * 0.1;
        hitArmorResist.fireResist *= avgEnvironmentalProtection * 0.1;
      }

      hitArmorResist.acidResist += resultItem.acidResist;
      hitArmorResist.fireResist += resultItem.fireResist;
      hitArmorResist.encumber = resultItem.encumber;
      hitArmorResist.maxEncumber = resultItem.maxEncumber;
      hitArmorResist.envResist = resultItem.envResist;
      hitArmorResist.envFilterResist = resultItem.envFilterResist;
      newResult.push(hitArmorResist);

      // if the material is miss
      if (armorMaterial.coverage < 100) {
        const missArmorResist = cloneDeep(resultItem);

        missArmorResist.probability = resultItem.probability * (100 - armorMaterial.coverage) * 0.01;
        newResult.push(missArmorResist);
      }
    });
    result = newResult;
  });

  return result;
}
