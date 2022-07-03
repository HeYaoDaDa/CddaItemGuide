import { CddaSubItem } from 'src/classes';
import { getString } from 'src/utils/json';
import { ViewUtil } from 'src/utils/ViewUtil';

export class ToHit extends CddaSubItem {
  normalizeInter = 0;
  grip?: string;
  length?: string;
  surface?: string;
  balance?: string;
  numberToHit?: number;

  parseJson(jsonObject: unknown): this {
    if (typeof jsonObject === 'number') {
      this.normalizeInter = jsonObject;
      jsonObject = {};
    }

    this.grip = getString(jsonObject as Record<string, unknown>, 'grip', ToHitGrip[ToHitGrip.weapon]);
    this.length = getString(jsonObject as Record<string, unknown>, 'length', ToHitLength[ToHitLength.hand]);
    this.surface = getString(jsonObject as Record<string, unknown>, 'surface', ToHitSurface[ToHitSurface.any]);
    this.balance = getString(jsonObject as Record<string, unknown>, 'balance', ToHitBalance[ToHitBalance.neutral]);

    if (!this.numberToHit) {
      this.numberToHit = numToHitObject(this);
    }

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.normalizeInter });
  }
}

enum ToHitGrip {
  bad = 0,
  none = 1,
  solid = 2,
  weapon = 3,
  last = 4,
}

function stringToGrip(value?: string) {
  switch (value) {
    case 'bad':
      return 0;
    case 'none':
      return 1;
    case 'solid':
      return 2;
    case 'weapon':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

enum ToHitLength {
  hand = 0,
  short = 1,
  long = 2,
  last = 3,
}

function stringToLength(value?: string) {
  switch (value) {
    case 'hand':
      return 0;
    case 'short':
      return 1;
    case 'long':
      return 2;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

enum ToHitSurface {
  point = 0,
  line = 1,
  any = 2,
  every = 3,
  last = 4,
}

function stringToSurface(value?: string) {
  switch (value) {
    case 'point':
      return 0;
    case 'line':
      return 1;
    case 'any':
      return 2;
    case 'every':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

enum ToHitBalance {
  clumsy = 0,
  uneven = 1,
  neutral = 2,
  good = 3,
  last = 4,
}

function stringToBalance(value?: string) {
  switch (value) {
    case 'clumsy':
      return 0;
    case 'uneven':
      return 1;
    case 'neutral':
      return 2;
    case 'good':
      return 3;
    case 'last':
      return 0;
    default:
      return 0;
  }
}

function numToHitObject(value: ToHit) {
  return (
    stringToBalance(value.balance) +
    stringToGrip(value.grip) +
    stringToLength(value.length) +
    stringToSurface(value.surface) -
    7
  );
}
