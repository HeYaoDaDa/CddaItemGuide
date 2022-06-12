import { myLogger } from 'src/boot/logger';
import { CddaSubItem } from 'src/classes';
import { isNotEmpty } from 'src/utils';

export function paramConvert(o: unknown): Record<string, unknown> | undefined {
  if (typeof o === 'object') {
    return o as Record<string, unknown>;
  }
  myLogger.warn(o, ' is not object');
}

export function getOptionalUnknown(value: unknown, key: string): unknown | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    return jsonObject[key];
  } else {
    return undefined;
  }
}

export function getOptionalObject(value: unknown, key: string): object | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (result && typeof result === 'object') {
      return result;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getOptionalArray(value: unknown, key: string): Array<unknown> | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (Array.isArray(result)) {
      return result as Array<unknown>;
    } else {
      return [result];
    }
  } else {
    return undefined;
  }
}

export function getArray(value: unknown, key: string, def?: Array<unknown>): Array<unknown> {
  return getOptionalArray(value, key) ?? def ?? [];
}

export function getOptionalString(value: unknown, key: string): string | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'string' || typeof result === 'number') {
      return result as string;
    } else {
      myLogger.warn('getOptionalString is no string jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
      return result as string;
    }
  } else {
    return undefined;
  }
}

export function getString(value: unknown, key: string, def?: string): string {
  return getOptionalString(value, key) ?? def ?? '';
}

export function getOptionalNumber(value: unknown, key: string): number | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'number') {
      return result;
    } else {
      myLogger.warn('getOptionalNumber is no string jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
      return result as number;
    }
  } else {
    return undefined;
  }
}

export function getNumber(value: unknown, key: string, def?: number): number {
  return getOptionalNumber(value, key) ?? def ?? 0;
}

export function getOptionalBoolean(value: unknown, key: string): boolean | undefined {
  const jsonObject = paramConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'boolean') {
      return result;
    } else {
      myLogger.warn('getOptionalBoolean is no boolean jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
      return false;
    }
  } else {
    return undefined;
  }
}

export function getBoolean(value: unknown, key: string, def?: boolean): boolean {
  return getOptionalBoolean(value, key) ?? def ?? false;
}

export function initCddaSubItemByJson<T extends CddaSubItem>(
  jsonObject: unknown | undefined,
  ins: T,
  ...extend: unknown[]
): T | undefined {
  if (jsonObject === undefined) return undefined;
  if (isNotEmpty(extend)) return ins.parseJson(jsonObject, ...extend);
  else return ins.parseJson(jsonObject);
}

export function getOptionalArrayWithType<T>(
  jsonObject: unknown,
  key: string,
  ins: T,
  ...extend: unknown[]
): Array<T> | undefined {
  const temps = getOptionalArray(jsonObject, key);
  if (ins instanceof CddaSubItem) {
    return temps?.map((temp) => initCddaSubItemByJson(temp, ins, ...extend) as T);
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
