import { isEmpty } from './isEmpty';

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

export function popFilter<T>(soures: T[], fu: (soure: T) => boolean): T[] {
  const result = new Array<T>();
  if (isEmpty(soures)) return result;
  const l = soures.length;
  for (let i = l - 1; i > -1; i--) {
    if (fu(soures[i])) {
      result.push(soures[i]);
      soures.splice(i, 1);
    }
  }
  return result;
}
