import { isEqual } from 'lodash';
import { CddaItem } from 'src/types/CddaItem';
import { MyClass } from 'src/types/EqualClass';
import { arrayIsNotEmpty, replaceArray } from '../commonUtil';
import {
  getOptionalBoolean,
  getOptionalNumber,
  getOptionalObject,
  getOptionalString,
  getOptionalUnknown,
} from './baseJsonUtil';
import { getOptionalArrayWithType, getOptionalMyClass } from './dataJsonUtil';

export class JsonParseUtil {
  relative?: Record<string, number>;
  proportional?: Record<string, number>;
  extend?: object;
  delete?: object;
  jsonObject: object;
  enabled = false;

  constructor(cddaItem: CddaItem) {
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
        if (arrayIsNotEmpty(newResult)) return newResult;
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

  getOptionalMyClass<T extends MyClass<T>>(key: string, ins: T, ...extend: unknown[]): T | undefined {
    return getOptionalMyClass(this.jsonObject, key, ins, ...extend);
  }

  getMyClass<T extends MyClass<T>>(key: string, def: T, ...extend: unknown[]): T {
    return this.getOptionalMyClass<T>(key, def, ...extend) ?? def;
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
        if (arrayIsNotEmpty(result) && deleteItems) {
          return result.filter((resultItem) => {
            if (resultItem instanceof MyClass) {
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
