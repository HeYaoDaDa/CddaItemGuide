import { CddaSubItem } from 'src/classes/base/CddaSubItem';
import { CddaItemRef, GettextString, Length, Volume } from 'src/classes/items';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isEmpty, isNotEmpty } from 'src/utils';
import {
  getArrayWithType,
  getBoolean,
  getLength,
  getNumber,
  getOptionalCddaItemRef,
  getOptionalCddaSubItem,
  getOptionalGettextString,
  getOptionalVolume,
  getString,
  getVolume,
  getWeight,
} from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';
import { ammoRestrictionItemVersionFactory } from './AmmoRestrictionItem/AmmoRestrictionItemVersionFactory';
import { pocketNoiseVersionFactory } from './PocketNoise/PocketNoiseVersionFactory';
import { sealablethisVersionFactory } from './Sealablethis/SealablethisVersionFactory';

export class Pocket extends CddaSubItem {
  pocketType!: string;
  description?: GettextString;
  name?: GettextString;

  volumeCapacity!: Volume;
  weightCapacity!: Volume;

  maxItemVolume?: Volume;
  minItemVolume!: Volume;

  maxItemLength!: Length;
  minItemLength!: Length;

  extraEncumbrance!: number;
  volumeEncumberModifier!: number;
  ripoff!: number;
  activityNoise?: CddaSubItem;
  spoilMultiplier!: number;
  weightMultiplier!: number;
  volumeMultiplier!: number;
  magazineWell!: Volume;
  moves!: number;
  sealedthis?: CddaSubItem;

  ammoRestriction!: CddaSubItem[];
  allowedSpeedloaders!: CddaItemRef[];
  flagRestrictions!: CddaItemRef[];
  itemIdRestriction!: CddaItemRef[];
  defaultMagazine?: CddaItemRef;

  openContainer!: boolean;
  holster!: boolean;
  ablative!: boolean;
  fireProtection!: boolean;
  watertight!: boolean;
  airtight!: boolean;
  rigid!: boolean;

  parseJson(jsonObject: unknown): this {
    this.pocketType = getString(jsonObject, 'pocket_type', PocketType.CONTAINER);
    this.name = getOptionalGettextString(jsonObject, 'name');
    this.description = getOptionalGettextString(jsonObject, 'description');
    this.flagRestrictions = getArrayWithType(jsonObject, 'flag_restriction', new CddaItemRef(), [], jsonTypes.flag);
    this.allowedSpeedloaders = getArrayWithType(
      jsonObject,
      'allowed_speedloaders',
      new CddaItemRef(),
      [],
      jsonTypes.item
    );
    this.itemIdRestriction = getArrayWithType(jsonObject, 'item_restriction', new CddaItemRef(), [], jsonTypes.item);
    this.defaultMagazine = getOptionalCddaItemRef(jsonObject, 'default_magazine', jsonTypes.item);

    if (isNotEmpty(this.itemIdRestriction) && isEmpty(this.defaultMagazine?.id)) {
      this.defaultMagazine = this.itemIdRestriction[0];
    }

    this.ammoRestriction = getArrayWithType(
      jsonObject,
      'ammo_restriction',
      ammoRestrictionItemVersionFactory.getProduct()
    );
    this.minItemVolume = getVolume(jsonObject, 'min_item_volume');
    this.maxItemVolume = getOptionalVolume(jsonObject, 'max_item_volume');
    this.volumeCapacity = getVolume(jsonObject, 'max_contains_volume', 200000 * 1000);
    this.weightCapacity = getWeight(jsonObject, 'max_contains_weight', 200000 * 1000 * 1000);
    this.maxItemLength = getLength(jsonObject, 'max_item_length', Math.round(Math.cbrt(this.volumeCapacity.value)));
    this.minItemLength = getLength(jsonObject, 'min_item_length');
    this.extraEncumbrance = getNumber(jsonObject, 'extra_encumbrance');
    this.volumeEncumberModifier = getNumber(jsonObject, 'volume_encumber_modifier', 1);
    this.ripoff = getNumber(jsonObject, 'ripoff');
    this.spoilMultiplier = getNumber(jsonObject, 'spoil_multiplier', 1);
    this.weightMultiplier = getNumber(jsonObject, 'weight_multiplier', 1);
    this.volumeMultiplier = getNumber(jsonObject, 'volume_multiplier', 1);
    this.magazineWell = getVolume(jsonObject, 'magazine_well');
    this.moves = getNumber(jsonObject, 'moves', 100);
    this.fireProtection = getBoolean(jsonObject, 'fire_protection');
    this.watertight = getBoolean(jsonObject, 'watertight');
    this.airtight = getBoolean(jsonObject, 'airtight');
    this.openContainer = getBoolean(jsonObject, 'open_container');
    this.rigid = getBoolean(jsonObject, 'rigid');
    this.holster = getBoolean(jsonObject, 'holster');
    this.ablative = getBoolean(jsonObject, 'ablative');

    if (this.ablative) {
      this.holster = true;
    }

    this.activityNoise = getOptionalCddaSubItem(jsonObject, 'activity_noise', pocketNoiseVersionFactory.getProduct());
    this.sealedthis = getOptionalCddaSubItem(jsonObject, 'sealed_this', sealablethisVersionFactory.getProduct());

    return this;
  }

  doView(util: ViewUtil): void {
    if (this.name) util.addField({ label: 'name', content: this.name });
    if (this.description) util.addField({ label: 'description', content: this.description });
    util.addField({ label: 'type', content: this.pocketType });

    if (isEmpty(this.ammoRestriction)) {
      util.addField({ label: 'weight', content: this.weightCapacity });
      util.addField({ label: 'volume', content: this.volumeCapacity });
      util.addField({ label: 'maxItemVolume', content: this.maxItemVolume });
      util.addField({ label: 'minItemVolume', content: this.minItemVolume });
      util.addField({ label: 'maxItemLength', content: this.maxItemLength });
      util.addField({ label: 'minItemLength', content: this.minItemLength });
      util.addField({ label: 'extraEncumbrance', content: this.extraEncumbrance });
      util.addField({ label: 'volumeEncumberModifier', content: this.volumeEncumberModifier });
      util.addField({ label: 'ripoff', content: this.ripoff });
      if (this.activityNoise) util.addField({ label: 'activityNoise', content: this.activityNoise });
      util.addField({ label: 'spoilMultiplier', content: this.spoilMultiplier });
      util.addField({ label: 'weightMultiplier', content: this.weightMultiplier });
      util.addField({ label: 'volumeMultiplier', content: this.volumeMultiplier });
      util.addField({ label: 'magazineWell', content: this.magazineWell });
      util.addField({ label: 'moves', content: this.moves });
      util.addField({ label: 'sealedthis', content: this.sealedthis });
    } else {
      util.addField({ label: 'ammoRestriction', content: this.ammoRestriction });
      util.addField({ label: 'allowedSpeedloaders', content: this.allowedSpeedloaders });
      util.addField({ label: 'flagRestrictions', content: this.flagRestrictions });
      util.addField({ label: 'itemIdRestriction', content: this.itemIdRestriction });
      util.addField({ label: 'defaultMagazine', content: this.defaultMagazine });
      util.addField({ label: 'openContainer', content: this.openContainer });
      util.addField({ label: 'holster', content: this.holster });
      util.addField({ label: 'ablative', content: this.ablative });
      util.addField({ label: 'fireProtection', content: this.fireProtection });
      util.addField({ label: 'watertight', content: this.watertight });
      util.addField({ label: 'airtight', content: this.airtight });
      util.addField({ label: 'rigid', content: this.rigid });
    }
  }
}

export enum PocketType {
  CONTAINER = 'CONTAINER',
  MAGAZINE = 'MAGAZINE',
  MAGAZINE_WELL = 'MAGAZINE_WELL', //holds magazines
  MOD = 'MOD', // the gunmods or toolmods
  CORPSE = 'CORPSE', // the "corpse" pocket - bionics embedded in a corpse
  SOFTWARE = 'SOFTWARE', // software put into usb or some such
  EBOOK = 'EBOOK', // holds electronic books for a device or usb
  MIGRATION = 'MIGRATION', // this allows items to load contents that are too big, in order to spill them later.
  LAST = 'LAST',
}
