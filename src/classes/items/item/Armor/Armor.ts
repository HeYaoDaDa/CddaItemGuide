import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef } from 'src/classes/items';
import { Flag } from 'src/constants/flag';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { cloneDeep, isEmpty, isNotEmpty } from 'src/utils';
import { getArrayWithType, getBoolean, getNumber, getOptionalCddaItemRef, getOptionalNumber } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { BodyPart } from '../../bodyPart/BodyPart/BodyPart';
import { SubBodyPart } from '../../bodyPart/SubBodyPart/SubBodyPart';
import { Material } from '../../material/Material/Material';
import { BaseItem } from '../BaseItem';
import { ArmorMaterial } from './ArmorMaterial/ArmorMaterial';
import { ArmorPortion } from './ArmorPortion/ArmorPortion';

export class Armor extends CddaSubItem {
  item!: BaseItem;
  sided!: boolean;
  nonFunctional?: CddaItemRef;
  warmth!: number;
  weightCapacityModifier!: number;
  weightCapacityBonus!: number;
  powerArmor!: boolean;
  armorPortions!: ArmorPortion[];
  subArmorPortions!: ArmorPortion[];
  rigid!: boolean;
  comfortable!: boolean;
  validMods!: CddaItemRef[];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  allLayers!: CddaItemRef[];

  armorResists!: ArmorResistInterface[][];

  parseJson(jsonObject: unknown, item: BaseItem): this {
    const covers: CddaItemRef[] = getArrayWithType(jsonObject, 'covers', new CddaItemRef(), [], jsonTypes.bodyPart);

    this.item = item;
    this.materialThickness = getOptionalNumber(jsonObject, 'material_thickness');
    this.environmentalProtection = getOptionalNumber(jsonObject, 'environmental_protection');
    this.environmentalProtectionFilter = getOptionalNumber(jsonObject, 'environmental_protection_with_filter');
    this.sided = getBoolean(jsonObject, 'sided', false);
    this.warmth = getNumber(jsonObject, 'warmth', 0);
    this.weightCapacityModifier = getNumber(jsonObject, 'weight_capacity_modifier', 1);
    this.weightCapacityBonus = getNumber(jsonObject, 'weight_capacity_bonus', 0);
    this.powerArmor = getBoolean(jsonObject, 'power_armor', false);
    this.nonFunctional = getOptionalCddaItemRef(jsonObject, 'non_functional', jsonTypes.item);
    this.validMods = getArrayWithType(jsonObject, 'valid_mods', new CddaItemRef(), [], jsonTypes.item);
    this.subArmorPortions = getArrayWithType(jsonObject, 'armor', new ArmorPortion());
    this.subArmorPortions.forEach((subArmorPortion) => {
      if (this.materialThickness) subArmorPortion.avgThickness = this.materialThickness;
      if (this.environmentalProtection) subArmorPortion.environmentalProtection = this.environmentalProtection;
      if (this.environmentalProtectionFilter)
        subArmorPortion.environmentalProtectionWithFilter = this.environmentalProtectionFilter;
      if (isNotEmpty(covers)) {
        subArmorPortion.coversBodyPart = covers;
      }
    });

    return this;
  }

  doView(util: ViewUtil): void {
    throw new Error('Method not implemented.');
  }

  finalize(): void {
    this.subArmorPortions.forEach((subArmorPortion) => subArmorPortion.finalize());
    inferSubArmorPortionsArmorMaterial(this.subArmorPortions, this.item);
    setSubArmorPotionsField(this.subArmorPortions, this.item);
    setSubArmorPotionsrRigidComfortable(this.subArmorPortions);
    this.armorPortions = [];
    consolidateSubArmorPotions(this.armorPortions, this.subArmorPortions);
    scaleAmalgamizedPortion(this.armorPortions);
    this.allLayers = [];
    setAllLayer(this.allLayers, this.armorPortions, this.subArmorPortions, this.item);
    setFeetRigid(this.subArmorPortions);
    setNonTraditionalNoRigid(this.subArmorPortions);
    setArmorRigidAndComfortable(this);
    setBreathability(this.armorPortions);
    this.armorResists = computeArmorResists(this.subArmorPortions, this.getAvgEnvironmentalProtection());
  }

  public getAvgEnvironmentalProtection() {
    let result = 0;

    if (isEmpty(this.armorPortions)) {
      return 0;
    }

    this.armorPortions.forEach((armorPortion) => {
      result += armorPortion.environmentalProtection;
    });

    return Math.round(result / this.armorPortions.length);
  }
}

interface ArmorResistInterface {
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

/**
 * if SubArmorPortions no has Armor Material
 * we need pass item's material infer it
 * @param item base item info
 */
function inferSubArmorPortionsArmorMaterial(subArmorPortions: ArmorPortion[], item: BaseItem) {
  subArmorPortions
    .filter((subArmorPortion) => isEmpty(subArmorPortion.armorMaterials))
    .forEach((subArmorPortion) => {
      const skipScale: boolean = item.data.materialPortionsTotal === 0;

      item.data.materials.forEach((itemMaterial) => {
        const armorMaterial = new ArmorMaterial();

        if (skipScale) {
          armorMaterial.parseJson({
            type: itemMaterial.material.id,
            thickness: item.data.materials.length * subArmorPortion.avgThickness,
            ignore_sheet_thickness: true,
          });
        } else {
          armorMaterial.parseJson({
            type: itemMaterial.material.id,
            thickness: (itemMaterial.portion / item.data.materialPortionsTotal) * subArmorPortion.avgThickness,
            ignore_sheet_thickness: true,
          });
        }

        subArmorPortion.armorMaterials.push(armorMaterial);
      });
    });
}

/**
 * set max encumber, avgThickness, rigid and comfortable
 * @param item base item info
 */
function setSubArmorPotionsField(subArmorPortions: ArmorPortion[], item: BaseItem) {
  subArmorPortions.forEach((subArmorPortion) => {
    // set max encumber
    if (!subArmorPortion.maxEncumber) {
      let totalNonrigidVolume = 0;

      item.data.pockets.map((pocket) => {
        if (!pocket.rigid) {
          totalNonrigidVolume += pocket.volumeCapacity.value * pocket.volumeEncumberModifier;
        }
      });
      subArmorPortion.maxEncumber =
        subArmorPortion.encumber + (totalNonrigidVolume * subArmorPortion.volumeEncumberModifier) / 250;
    }

    // reset avgThickness
    let armorMaterialCount = 0;
    let avgThickness = 0;

    subArmorPortion.armorMaterials.forEach((armorMaterial) => {
      avgThickness += (armorMaterial.thickness * armorMaterial.coverage) / 100;
      armorMaterialCount++;
    });

    if (armorMaterialCount > 0 && avgThickness > 0) {
      subArmorPortion.avgThickness = avgThickness;
    }
  });
}

function setSubArmorPotionsrRigidComfortable(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.forEach((subArmorPortion) =>
    subArmorPortion.armorMaterials
      .filter((armorMaterial) => armorMaterial.coverage > 40)
      .forEach((armorMaterial) => {
        const cddaItems = armorMaterial.id.getCddaItems();

        if (isNotEmpty(cddaItems)) {
          const material = cddaItems[0] as Material;

          if (material.data.soft) {
            subArmorPortion.isComfortable = true;
          } else {
            subArmorPortion.isRigid = true;
          }
        }
      })
  );
}

/**
 * consolidate SubArmorPotions to ArmorPotions
 */
function consolidateSubArmorPotions(armorPortions: ArmorPortion[], subArmorPortions: ArmorPortion[]) {
  subArmorPortions
    .filter((subArmorPortion) => isNotEmpty(subArmorPortion.coversBodyPart))
    .forEach((subArmorPortion) => {
      subArmorPortion.coversBodyPart.forEach((subCover) => {
        let found = false;

        armorPortions
          .filter((armorPortion) => armorPortion.coversBodyPart.some((bodyPartId) => bodyPartId.id === subCover.id))
          .forEach((armorPortion) => {
            found = true;
            addEncumber(armorPortion, subArmorPortion);

            let subScale = subArmorPortion.maxCoverage(subCover.id);
            let scale = armorPortion.maxCoverage(subCover.id);

            subScale *= 0.01;
            scale *= 0.01;
            consolidatePortionBaseInfo(armorPortion, subArmorPortion, subScale, scale);
            consolidateMaterial(subArmorPortion, armorPortion, subScale, scale);
            consolidateLayerAndSubBodyPart(subArmorPortion, armorPortion);
          });

        if (!found) {
          const newArmorPortion = getNewArmorPotrtion(subArmorPortion, subCover);

          armorPortions.push(newArmorPortion);
        }
      });
    });

  function getNewArmorPotrtion(subArmorPortion: ArmorPortion, subCover: CddaItemRef) {
    const newArmorPortion = cloneDeep(subArmorPortion);

    newArmorPortion.coversBodyPart = [subCover];

    const maxCoverage = newArmorPortion.maxCoverage(subCover.id);
    const scale = maxCoverage * 0.01;

    newArmorPortion.coverage *= scale;
    newArmorPortion.coverageMelee *= scale;
    newArmorPortion.coverageRanged *= scale;
    newArmorPortion.armorMaterials.forEach((newArmorMaterial) => {
      newArmorMaterial.coverage *= newArmorPortion.coverage / 100;
    });
    newArmorPortion.finalize();

    return newArmorPortion;
  }

  function consolidateLayerAndSubBodyPart(subArmorPortion: ArmorPortion, armorPortion: ArmorPortion) {
    subArmorPortion.layers.forEach((subLayer) => {
      if (!armorPortion.layers.some((layer) => layer.id === subLayer.id)) {
        armorPortion.layers.push(subLayer);
      }
    });
    subArmorPortion.coversSubBodyPart.forEach((subArmorSubBodyPart) => {
      if (!armorPortion.coversSubBodyPart.some((armorSubBodyPart) => armorSubBodyPart.id === subArmorSubBodyPart.id)) {
        armorPortion.coversSubBodyPart.push(subArmorSubBodyPart);
      }
    });
  }

  function consolidatePortionBaseInfo(
    armorPortion: ArmorPortion,
    subArmorPortion: ArmorPortion,
    subScale: number,
    scale: number
  ) {
    armorPortion.coverage += subArmorPortion.coverage * subScale;
    armorPortion.coverageMelee += subArmorPortion.coverageMelee * subScale;
    armorPortion.coverageRanged += subArmorPortion.coverageRanged * subScale;
    armorPortion.coverageVitals += subArmorPortion.coverageVitals;
    armorPortion.avgThickness =
      (subArmorPortion.avgThickness * subScale + armorPortion.avgThickness * scale) / (subScale + scale);
    armorPortion.environmentalProtection =
      (subArmorPortion.environmentalProtection * subScale + armorPortion.environmentalProtection * scale) /
      (subScale + scale);
    armorPortion.environmentalProtectionWithFilter =
      (subArmorPortion.environmentalProtectionWithFilter * subScale +
        armorPortion.environmentalProtectionWithFilter * scale) /
      (subScale + scale);
  }

  function addEncumber(armorPortion: ArmorPortion, subArmorPortion: ArmorPortion) {
    armorPortion.encumber += subArmorPortion.encumber;

    if (subArmorPortion.maxEncumber) {
      if (armorPortion.maxEncumber) {
        armorPortion.maxEncumber += subArmorPortion.maxEncumber;
      } else {
        armorPortion.maxEncumber = subArmorPortion.maxEncumber;
      }
    }
  }

  function consolidateMaterial(
    subArmorPortion: ArmorPortion,
    armorPortion: ArmorPortion,
    subScale: number,
    scale: number
  ) {
    subArmorPortion.armorMaterials.forEach((subArmorMaterial) => {
      let materialFound = false;

      armorPortion.armorMaterials.forEach((armorMaterial) => {
        if (subArmorMaterial.id.id === armorMaterial.id.id) {
          materialFound = true;

          const coverageMultiplier = (subArmorPortion.coverage * subScale) / 100;

          armorMaterial.coverage += (subArmorMaterial.coverage * coverageMultiplier) / 100;
          armorMaterial.thickness =
            (subScale * subArmorMaterial.thickness + scale * armorMaterial.thickness) / (subScale + scale);
        }
      });

      if (!materialFound) {
        const coverageMultiplier = (subArmorPortion.coverage * subScale) / 100;
        const newMaterial: ArmorMaterial = cloneDeep(subArmorMaterial);

        newMaterial.coverage = (subArmorMaterial.coverage * coverageMultiplier) / 100;
        armorPortion.armorMaterials.push(newMaterial);
      }
    });
  }
}

/**
 * scale armorPortions's material
 */
function scaleAmalgamizedPortion(armorPortions: ArmorPortion[]) {
  armorPortions.forEach((armorPortion) => {
    armorPortion.armorMaterials.forEach((armorMaterial) => {
      if (armorPortion.coverage == 0) {
        armorMaterial.coverage = 100;
      } else {
        armorMaterial.coverage = Math.round(armorMaterial.coverage / (armorPortion.coverage / 100));
      }
    });
  });
}

/**
 * set all Layer
 */
function setAllLayer(
  allLayers: CddaItemRef[],
  armorPortions: ArmorPortion[],
  subArmorPortions: ArmorPortion[],
  item: BaseItem
) {
  if (item.hasFlag(Flag.PERSONAL)) {
    allLayers.push(CddaItemRef.init(Flag.PERSONAL, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.SKINTIGHT)) {
    allLayers.push(CddaItemRef.init(Flag.SKINTIGHT, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.NORMAL)) {
    allLayers.push(CddaItemRef.init(Flag.NORMAL, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.WAIST)) {
    allLayers.push(CddaItemRef.init(Flag.WAIST, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.OUTER)) {
    allLayers.push(CddaItemRef.init(Flag.OUTER, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.BELTED)) {
    allLayers.push(CddaItemRef.init(Flag.BELTED, jsonTypes.flag));
  }

  if (item.hasFlag(Flag.AURA)) {
    allLayers.push(CddaItemRef.init(Flag.AURA, jsonTypes.flag));
  }

  if (isEmpty(allLayers)) {
    allLayers = [CddaItemRef.init(Flag.NORMAL, jsonTypes.flag)];
  }

  armorPortions.forEach((armorPortion) => {
    if (isEmpty(armorPortion.layers)) {
      armorPortion.layers = allLayers;
    } else {
      armorPortion.layers.forEach((protionLayer) => {
        if (!allLayers.some((layer) => layer.id === protionLayer.id)) {
          allLayers.push(protionLayer);
        }
      });
    }
  });
  subArmorPortions.forEach((subArmorPortion) => {
    if (isEmpty(subArmorPortion.layers)) {
      subArmorPortion.layers = allLayers;
    }
  });
}

function setFeetRigid(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.map((subArmorPortion) => {
    const isNormal = subArmorPortion.layers.some((layer) => layer.id === Flag.NORMAL);
    let isLeg = false;

    subArmorPortion.coversSubBodyPart.map((coverSubBodyPart) => {
      const cddaItems = coverSubBodyPart.getCddaItems();

      if (isNotEmpty(cddaItems)) {
        const subBodyPart = cddaItems[0] as SubBodyPart;
        if (subBodyPart.data.parent.id === 'bp_leg_l' || subBodyPart.data.parent.id === 'bp_leg_r') isLeg = true;
      }
    });

    if (isNormal && isLeg) {
      subArmorPortion.isRigid = true;
    }
  });
}

/**
 * NonTraditional is soft
 */
function setNonTraditionalNoRigid(subArmorPortions: ArmorPortion[]) {
  subArmorPortions.forEach((subArmorPortion) => {
    if (
      !subArmorPortion.layers.some(
        (subLayer) => subLayer.id == Flag.SKINTIGHT || subLayer.id == Flag.NORMAL || subLayer.id == Flag.OUTER
      )
    ) {
      subArmorPortion.isRigid = false;
    }
  });
}

function setArmorRigidAndComfortable(armor: Armor) {
  let allRigid = true;
  let allComfortable = true;

  armor.subArmorPortions.forEach((subArmorPortion) => {
    allRigid = allRigid && subArmorPortion.isRigid;
    allComfortable = allComfortable && subArmorPortion.isComfortable;
  });
  armor.rigid = allRigid;
  armor.comfortable = allComfortable;
}

function setBreathability(armorPortions: ArmorPortion[]) {
  const needUpdateArmorPortion = new Array<ArmorPortion>();

  armorPortions.forEach((armorPortion) => {
    if (!armorPortion.breathability || armorPortion.breathability < 0) {
      needUpdateArmorPortion.push(armorPortion);
    }
  });
  needUpdateArmorPortion.forEach((armorPortion) => {
    const result = armorPortion.armorMaterials.map((armorMaterial) => {
      const cddaItems = armorMaterial.id.getCddaItems();

      return [cddaItems[0] as Material, armorMaterial.coverage] as [Material, number];
    });
    const sordMaterial = result.sort((a, b) => a[0].data.breathability.num - b[0].data.breathability.num);
    let coverage_counted = 0;
    let combined_breathability = 0;

    for (const material of sordMaterial) {
      combined_breathability += Math.max((material[1] - coverage_counted) * material[0].data.breathability.num, 0);
      coverage_counted = Math.max(material[1], coverage_counted);
      if (coverage_counted == 100) break;
    }

    armorPortion.breathability = combined_breathability / 100 + 100 - coverage_counted;
  });
}

export function computeArmorResists(subArmorPortions: ArmorPortion[], env: number) {
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
