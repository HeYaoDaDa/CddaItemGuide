import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef } from 'src/classes/items';
import { BodyPart } from 'src/classes/items/bodyPart/BodyPart/BodyPart';
import { SubBodyPart } from 'src/classes/items/bodyPart/SubBodyPart/SubBodyPart';
import { breathabilityToNumber } from 'src/classes/items/material/MaterialBreathability/MaterialBreathability';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isEmpty, isNotEmpty } from 'src/utils';
import {
  getArrayWithType,
  getBoolean,
  getNumber,
  getOptionalNumber,
  getOptionalUnknown,
  getString,
} from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { ArmorMaterial } from '../ArmorMaterial/ArmorMaterial';

export class ArmorPortion extends CddaSubItem {
  encumber!: number;
  maxEncumber?: number;

  volumeEncumberModifier!: number;

  coverage!: number;
  coverageMelee!: number;
  coverageRanged!: number;
  coverageVitals!: number;

  avgThickness!: number;

  environmentalProtection!: number;
  environmentalProtectionWithFilter!: number;

  armorMaterials!: ArmorMaterial[];

  coversBodyPart!: CddaItemRef[];
  coversSubBodyPart!: CddaItemRef[];
  layers!: CddaItemRef[];

  breathability?: number;
  isRigidLayerOnly!: boolean;

  isRigid!: boolean;
  isUniqueLayering!: boolean;
  isComfortable!: boolean;

  parseJson(jsonObject: unknown): this {
    const encumbranceJson = getOptionalUnknown(jsonObject, 'encumbrance');

    if (encumbranceJson) {
      if (Array.isArray(encumbranceJson)) {
        this.encumber = (<Array<number>>encumbranceJson)[0];
        this.maxEncumber = (<Array<number>>encumbranceJson)[1];
      } else {
        this.encumber = <number>encumbranceJson;
      }
    }

    this.volumeEncumberModifier = getNumber(jsonObject, 'volume_encumber_modifier', 1);
    this.coverage = getNumber(jsonObject, 'coverage', 0);
    this.coverageMelee = getNumber(jsonObject, 'cover_melee', this.coverage);
    this.coverageRanged = getNumber(jsonObject, 'cover_ranged', this.coverage);
    this.coverageVitals = getNumber(jsonObject, 'cover_vitals', 0);
    this.avgThickness = getNumber(jsonObject, 'material_thickness', 0);
    this.environmentalProtection = getNumber(jsonObject, 'environmental_protection', 0);
    this.environmentalProtectionWithFilter = getNumber(jsonObject, 'environmental_protection_with_filter', 0);

    const tempBreathability = getString(jsonObject, 'breathability');
    if (tempBreathability) this.breathability = breathabilityToNumber(tempBreathability);
    this.isRigidLayerOnly = getBoolean(jsonObject, 'rigid_layer_only', false);
    this.armorMaterials = getArrayWithType(jsonObject, 'material', new ArmorMaterial());
    this.layers = getArrayWithType(jsonObject, 'layers', new CddaItemRef(), [], jsonTypes.flag);
    this.coversBodyPart = getArrayWithType(jsonObject, 'covers', new CddaItemRef(), [], jsonTypes.bodyPart);
    this.coversSubBodyPart = getArrayWithType(
      jsonObject,
      'specifically_covers',
      new CddaItemRef(),
      [],
      jsonTypes.subBodyPart
    );

    return this;
  }

  finalize(): void {
    // if is empty, add body part's all sub body part
    if (isEmpty(this.coversSubBodyPart) && isNotEmpty(this.coversBodyPart)) {
      this.coversBodyPart.forEach((item) => {
        const cddaItems = item.getCddaItems();

        if (isNotEmpty(cddaItems)) {
          const bodyPart = cddaItems[0] as BodyPart;

          this.coversSubBodyPart.push(...bodyPart.data.subBodyParts);
        }
      });
    }
  }

  public maxCoverage(bodyPartId: string): number {
    if (isEmpty(this.coversSubBodyPart)) {
      return 100;
    }

    let primary = 0;
    let secondary = 0;

    this.coversSubBodyPart.forEach((subCover) => {
      const cddaItems = subCover.getCddaItems();

      if (isNotEmpty(cddaItems)) {
        const subBodyPart = cddaItems[0] as SubBodyPart;

        if (subBodyPart.data.parent.id === bodyPartId) {
          if (subBodyPart.data.secondary) {
            secondary += subBodyPart.data.maxCoverage;
          } else {
            primary += subBodyPart.data.maxCoverage;
          }
        }
      }
    });

    return primary > secondary ? primary : secondary;
  }

  doView(util: ViewUtil): void {
    //TODO:no need?
  }
}
