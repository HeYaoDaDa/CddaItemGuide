import { i18n } from 'src/boot/i18n';
import { itemJsonTypes } from 'src/constants/jsonTypesConstant';

export function arrayIsEmpty(value: Array<unknown> | undefined): boolean {
  return value == undefined || value.length === 0;
}

export function arrayIsNotEmpty(value: Array<unknown> | undefined): boolean {
  return !arrayIsEmpty(value);
}

export function stringIsEmpty(value: string | undefined): boolean {
  return value == undefined || value.length === 0;
}

export function stringIsNotEmpty(value: string | undefined): boolean {
  return !stringIsEmpty(value);
}

export function toArray<T>(val: T | T[]): T[] {
  if (Array.isArray(val)) {
    return val;
  } else {
    return [val];
  }
}

export function replaceArray<T>(soure: T[], newArr: T[]) {
  return soure.splice(0, soure.length, ...newArr);
}

export function convertToJsonType(type: string): string[] {
  if (type === 'item') {
    return itemJsonTypes;
  } else {
    return [type];
  }
}

export function convertToType(jsonType: string): string {
  if (itemJsonTypes.find((itemJsonType) => itemJsonType === jsonType)) {
    return 'item';
  } else {
    return jsonType;
  }
}

export function popFilter<T>(soures: T[], fu: (soure: T) => boolean): T[] {
  const result = new Array<T>();
  if (arrayIsEmpty(soures)) return result;
  const l = soures.length;
  for (let i = l - 1; i > -1; i--) {
    if (fu(soures[i])) {
      result.push(soures[i]);
      soures.splice(i, 1);
    }
  }
  return result;
}

export function formatBooleanAndNumber(value: unknown) {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      if (Number.isInteger(value)) {
        return Math.trunc(value);
      } else {
        return value.toFixed(2);
      }
    case 'boolean':
      return i18n.global.t('base.' + (value ? 'true' : 'false'));
    default:
      return value;
  }
}
