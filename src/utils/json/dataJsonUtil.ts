import { CddaItemRef } from 'src/types/CddaItemRef';
import { MyClass } from 'src/types/EqualClass';
import { getArray, getOptionalArray, getOptionalString } from './baseJsonUtil';
import { parseLengthToCm, parseTimeToS, parseVolumeToMl, parseWeightToG } from './dataUtil';

export function getOptionalCddaItemRef(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string
): CddaItemRef | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return new CddaItemRef(field, type);
  } else {
    return undefined;
  }
}

export function getCddaItemRef(
  jsonObject: Record<string, unknown>,
  key: string,
  type: string,
  def?: CddaItemRef
): CddaItemRef {
  return getOptionalCddaItemRef(jsonObject, key, type) ?? def ?? new CddaItemRef(key, type);
}

export function getCddaItemRefs(jsonObject: Record<string, unknown>, key: string, type: string): CddaItemRef[] {
  return getArray(jsonObject, key, []).map((value) => new CddaItemRef(<string>value, type));
}

export function getOptionalWeight(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseWeightToG(field);
  } else {
    return undefined;
  }
}

export function getWeight(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalWeight(jsonObject, key) ?? def ?? 0;
}

export function getOptionalVolume(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseVolumeToMl(field);
  } else {
    return undefined;
  }
}

export function getVolume(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalVolume(jsonObject, key) ?? def ?? 0;
}

export function getOptionalLength(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseLengthToCm(field);
  } else {
    return undefined;
  }
}

export function getLength(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalLength(jsonObject, key) ?? def ?? 0;
}

export function getOptionalTime(jsonObject: Record<string, unknown>, key: string): number | undefined {
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseTimeToS(field);
  } else {
    return undefined;
  }
}

export function getTime(jsonObject: Record<string, unknown>, key: string, def?: number): number {
  return getOptionalTime(jsonObject, key) ?? def ?? 0;
}

export function getOptionalArrayWithType<T>(
  jsonObject: unknown,
  key: string,
  ins: T,
  ...extend: unknown[]
): Array<T> | undefined {
  const temps = getOptionalArray(jsonObject, key);
  if (ins instanceof MyClass) {
    return temps?.map((temp) => ins.fromJson(temp, extend) as T);
  }
  return temps?.map((temp) => temp as T);
}
