import { MyClass } from 'src/types/EqualClass';
import { arrayIsNotEmpty } from '../commonUtil';
import { commonConvert, getOptionalArray, getOptionalString, getOptionalUnknown } from './baseJsonUtil';
import { parseLengthToCm, parseTimeToS, parseVolumeToMl, parseWeightToG } from './dataUtil';

export function getOptionalWeight(value: unknown, key: string): number | undefined {
  const jsonObject = commonConvert(value);
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseWeightToG(field);
  } else {
    return undefined;
  }
}

export function getWeight(value: unknown, key: string, def?: number): number {
  const jsonObject = commonConvert(value);
  return getOptionalWeight(jsonObject, key) ?? def ?? 0;
}

export function getOptionalVolume(value: unknown, key: string): number | undefined {
  const jsonObject = commonConvert(value);
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseVolumeToMl(field);
  } else {
    return undefined;
  }
}

export function getVolume(value: unknown, key: string, def?: number): number {
  const jsonObject = commonConvert(value);
  return getOptionalVolume(jsonObject, key) ?? def ?? 0;
}

export function getOptionalLength(value: unknown, key: string): number | undefined {
  const jsonObject = commonConvert(value);
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseLengthToCm(field);
  } else {
    return undefined;
  }
}

export function getLength(value: unknown, key: string, def?: number): number {
  const jsonObject = commonConvert(value);
  return getOptionalLength(jsonObject, key) ?? def ?? 0;
}

export function getOptionalTime(value: unknown, key: string): number | undefined {
  const jsonObject = commonConvert(value);
  const field = getOptionalString(jsonObject, key);
  if (field) {
    return parseTimeToS(field);
  } else {
    return undefined;
  }
}

export function getTime(value: unknown, key: string, def?: number): number {
  const jsonObject = commonConvert(value);
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
    return temps?.map((temp) => callFromJson(temp, ins, ...extend) as T);
  }
  if (Array.isArray(ins)) {
    return temps?.map((temp, i) => {
      return getOptionalArrayWithType(temps, i.toString(), ins[0], ...extend) as unknown as T;
    });
  }
  return temps?.map((temp) => temp as T);
}

export function getArrayWithType<T>(
  jsonObject: unknown,
  key: string,
  ins: T,
  def?: Array<T>,
  ...extend: unknown[]
): Array<T> {
  return getOptionalArrayWithType(jsonObject, key, ins, ...extend) ?? def ?? [];
}

export function getOptionalMyClass<T extends MyClass<T>>(
  jsonObject: unknown,
  key: string,
  ins: T,
  ...extend: unknown[]
): T | undefined {
  const optionalUnknown = getOptionalUnknown(jsonObject, key);
  return callFromJson(optionalUnknown, ins, ...extend);
}

function callFromJson<T extends MyClass<T>>(jsonObject: unknown | undefined, ins: T, ...extend: unknown[]) {
  if (jsonObject === undefined) return undefined;
  if (arrayIsNotEmpty(extend)) return ins.fromJson(jsonObject, ...extend);
  else return ins.fromJson(jsonObject);
}

export function getMyClass<T extends MyClass<T>>(jsonObject: unknown, key: string, def: T, ...extend: unknown[]): T {
  return getOptionalMyClass(jsonObject, key, def, ...extend) ?? def;
}
