import { logger } from 'src/boot/logger';
import { GettextString } from 'src/types/GettextString';

function commonConvert(o: unknown): Record<string, unknown> | undefined {
  if (typeof o === 'object') {
    return o as Record<string, unknown>;
  }
  logger.warn(o, ' is not object');
}

export function getOptionalUnknown(value: unknown, key: string): unknown | undefined {
  const jsonObject = commonConvert(value);
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
  const jsonObject = commonConvert(value);
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
  const jsonObject = commonConvert(value);
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
  const jsonObject = commonConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'string' || typeof result === 'number') {
      return result as string;
    } else {
      console.warn('getOptionalString is no string jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
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
  const jsonObject = commonConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'number') {
      return result;
    } else {
      console.warn('getOptionalNumber is no string jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
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
  const jsonObject = commonConvert(value);
  if (!jsonObject) {
    return;
  }
  if (jsonObject.hasOwnProperty(key)) {
    const result = jsonObject[key];
    if (typeof result === 'boolean') {
      return result;
    } else {
      console.warn('getOptionalBoolean is no boolean jsonObject: %o, key: %s, result: %s', jsonObject, key, result);
      return false;
    }
  } else {
    return undefined;
  }
}

export function getBoolean(value: unknown, key: string, def?: boolean): boolean {
  return getOptionalBoolean(value, key) ?? def ?? false;
}

export function getOptionalGettextString(value: unknown, key: string): GettextString | undefined {
  const optionalUnknown = getOptionalUnknown(value, key);
  return GettextString.parseGetTextTransation(optionalUnknown);
}

export function getGettextString(value: unknown, key: string, def?: GettextString): GettextString {
  return getOptionalGettextString(value, key) ?? def ?? new GettextString({ str: key });
}