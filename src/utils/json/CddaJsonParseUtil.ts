import { CddaItem, CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemFactory } from 'src/classes/factory/cddaSubItem/AbstractCddaSubItemFactory';
import { CddaItemRef, GettextString, Volume, Length, Time, Weight } from 'src/classes/items';
import { isEqual, isNotEmpty, replaceArray } from 'src/utils';
import {
  getOptionalArrayWithType,
  getOptionalBoolean,
  getOptionalNumber,
  getOptionalObject,
  getOptionalString,
  getOptionalUnknown,
} from './base';
import {
  getCddaItemRef,
  getCddaSubItemUseVersionFactory,
  getGettextString,
  getLength,
  getOptionalCddaItemRef,
  getOptionalCddaSubItem,
  getOptionalCddaSubItemUseVersionFactory,
  getOptionalGettextString,
  getOptionalLength,
  getOptionalTime,
  getOptionalVolume,
  getOptionalWeight,
  getTime,
  getVolume,
  getWeight,
} from './dataJsonUtil';

export default class {
  relative?: Record<string, number>;
  proportional?: Record<string, number>;
  extend?: object;
  delete?: object;
  jsonObject: object;
  enabled = false;

  constructor(cddaItem: CddaItem<object>) {
    this.jsonObject = cddaItem.json;
    if (cddaItem.copyFromInfo) {
      this.relative = getOptionalUnknown(this.jsonObject, 'relative') as Record<string, number>;
      this.proportional = getOptionalUnknown(this.jsonObject, 'proportional') as Record<string, number>;
      this.extend = getOptionalUnknown(this.jsonObject, 'extend') as object;
      this.delete = getOptionalUnknown(this.jsonObject, 'delete') as object;
      this.enabled =
        this.relative !== undefined ||
        this.proportional !== undefined ||
        this.extend !== undefined ||
        this.delete !== undefined;
    }
  }

  getOptionalUnknown(key: string): unknown | undefined {
    return getOptionalUnknown(this.jsonObject, key);
  }

  getOptionalObject(key: string): object | undefined {
    return getOptionalObject(this.jsonObject, key);
  }

  getOptionalArray<T>(key: string, ins: T, fromNotEmpty?: boolean, ...extend: unknown[]): Array<T> | undefined {
    const result = getOptionalArrayWithType(this.jsonObject, key, ins, ...extend);
    if (!fromNotEmpty) {
      if (result) {
        replaceArray(result, this._processDeleteAndExtend(result, key, ins, ...extend));
        return result;
      } else {
        const newResult = this._processDeleteAndExtend([], key, ins, ...extend);
        if (isNotEmpty(newResult)) return newResult;
      }
    }
    return result;
  }

  getArray<T>(key: string, ins: T, def?: Array<T>, ...extend: unknown[]): Array<T> {
    const result: T[] = this.getOptionalArray(key, ins, true, ...extend) ?? def ?? [];
    replaceArray(result, this._processDeleteAndExtend(result, key, ins, ...extend));
    return result;
  }

  getOptionalString(key: string): string | undefined {
    return getOptionalString(this.jsonObject, key);
  }

  getString(key: string, def?: string): string {
    return this.getOptionalString(key) ?? def ?? '';
  }

  getOptionalNumber(key: string, fromNotEmpty?: boolean): number | undefined {
    let result = getOptionalNumber(this.jsonObject, key);
    if (result && !fromNotEmpty) result = this._processProportinalAndRelative(result, key);
    return result;
  }

  getNumber(key: string, def?: number): number {
    let result = this.getOptionalNumber(key, true) ?? def ?? 0;
    result = this._processProportinalAndRelative(result, key);
    return result;
  }

  getOptionalBoolean(key: string): boolean | undefined {
    return getOptionalBoolean(this.jsonObject, key);
  }

  getBoolean(key: string, def?: boolean): boolean {
    return this.getOptionalBoolean(key) ?? def ?? false;
  }

  getOptionalCddaSubItem<T extends CddaSubItem>(key: string, ins: T, ...extend: unknown[]): T | undefined {
    return getOptionalCddaSubItem(this.jsonObject, key, ins, ...extend);
  }

  getCddaSubItem<T extends CddaSubItem>(key: string, def: T, ...extend: unknown[]): T {
    return this.getOptionalCddaSubItem(key, def, ...extend) ?? def;
  }

  getOptionalCddaSubItemUseVersionFactory(
    key: string,
    factory: AbstractCddaSubItemFactory,
    ...extend: unknown[]
  ): CddaSubItem | undefined {
    return getOptionalCddaSubItemUseVersionFactory(this.jsonObject, key, factory, ...extend);
  }

  getCddaSubItemUseVersionFactory(key: string, factory: AbstractCddaSubItemFactory, ...extend: unknown[]): CddaSubItem {
    return getCddaSubItemUseVersionFactory(this.jsonObject, key, factory, ...extend);
  }

  getOptionalCddaItemRef(key: string, jsonType: string) {
    return getOptionalCddaItemRef(this.jsonObject, key, jsonType);
  }

  getCddaItemRef(key: string, jsonType: string, def?: CddaItemRef) {
    return getCddaItemRef(this.jsonObject, key, jsonType, def);
  }

  getOptionalGettextString(key: string, ctx?: string) {
    return getOptionalGettextString(this.jsonObject, key, ctx);
  }

  getGettextString(key: string, ctx?: string, def?: GettextString) {
    return getGettextString(this.jsonObject, key, ctx, def);
  }

  getOptionalVolume(key: string, mult?: number) {
    return getOptionalVolume(this.jsonObject, key, mult);
  }

  getVolume(key: string, mult?: number, def?: Volume) {
    return getVolume(this.jsonObject, key, mult, def);
  }

  getOptionalWeight(key: string, mult?: number) {
    return getOptionalWeight(this.jsonObject, key, mult);
  }

  getWeight(key: string, mult?: number, def?: Weight) {
    return getWeight(this.jsonObject, key, mult, def);
  }

  getOptionalLength(key: string, mult?: number) {
    return getOptionalLength(this.jsonObject, key, mult);
  }

  getLength(key: string, mult?: number, def?: Length) {
    return getLength(this.jsonObject, key, mult, def);
  }

  getOptionalTime(key: string, mult?: number) {
    return getOptionalTime(this.jsonObject, key, mult);
  }

  getTime(key: string, mult?: number, def?: Time) {
    return getTime(this.jsonObject, key, mult, def);
  }

  private _processProportinalAndRelative(result: number, key: string) {
    if (result && this.enabled) {
      if (this.proportional) {
        const proportionalNum = getOptionalNumber(this.proportional, key);
        if (proportionalNum && proportionalNum < 1 && proportionalNum >= 0) {
          result *= proportionalNum;
        }
      }
      if (this.relative) {
        const relativeNum = getOptionalNumber(this.relative, key);
        if (relativeNum) {
          result += relativeNum;
        }
      }
    }
    return result;
  }

  private _processDeleteAndExtend<T>(result: Array<T>, key: string, ins: T, ...extend: unknown[]): T[] {
    if (result && this.enabled) {
      if (this.extend) {
        const extendItems = getOptionalArrayWithType(this.extend, key, ins, ...extend);
        if (extendItems) {
          extendItems.forEach((extendItem) => {
            result.push(extendItem);
          });
        }
      }
      if (this.delete) {
        const deleteItems = getOptionalArrayWithType(this.delete, key, ins, ...extend);
        if (isNotEmpty(result) && deleteItems) {
          return result.filter((resultItem) => {
            if (resultItem instanceof CddaSubItem) {
              return !deleteItems.some((deleteItem) => resultItem.equal(deleteItem as unknown as object));
            } else {
              return !deleteItems.some((deleteItem) => isEqual(resultItem, deleteItem));
            }
          });
        }
      }
    }
    return result;
  }
}
