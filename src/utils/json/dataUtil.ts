import { itemJsonTypes } from 'src/constants/jsonTypesConstant';

export function parseVolumeToMl(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string * 250;
  if (string.endsWith('ml')) return parseInt(string);
  else if (string.endsWith('L')) return parseInt(string) * 1000;
  else return 0;
}

export function parseWeightToG(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string;
  if (string.endsWith('mg')) return parseInt(string) / 1000;
  if (string.endsWith('kg')) return parseInt(string) * 1000;
  if (string.endsWith('g')) return parseInt(string);
  else return 0;
}

export function parseLengthToCm(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string;
  if (string.endsWith('cm')) return parseInt(string);
  else if (string.endsWith('m')) return parseInt(string) * 1000;
  else return 0;
}

export function parseTimeToS(string: string | number): number {
  if (typeof string === 'undefined') return 0;
  if (typeof string === 'number') return string;
  const re = /([0-9]+)\s*([A-Za-z]+)?/;
  const result = re.exec(string);
  const value = parseInt(result?.[1] ?? '0');
  const unit = result?.[2] ?? 's';
  if (['turns', 'turn', 't', 'seconds', 'second', 's'].includes(unit)) {
    return value;
  } else if (['minutes', 'minute', 'm'].includes(unit)) {
    return value * 60;
  } else if (['hours', 'hour', 'h'].includes(unit)) {
    return value * 60 * 60;
  } else if (['days', 'day', 'd'].includes(unit)) {
    return value * 60 * 60 * 24;
  } else {
    return value;
  }
}

export function weightToString(value: number): string {
  if (value >= 1000 * 1000) {
    return `${value / 1000 / 1000} t`;
  } else if (value >= 1000) {
    return `${value / 1000} kg`;
  } else {
    return `${value} g`;
  }
}

export function lengthToString(value: number): string {
  if (value >= 1000 * 100) {
    return `${value / 1000 / 100} km`;
  } else if (value >= 100) {
    return `${value / 100} m`;
  } else {
    return `${value} cm`;
  }
}

export function volumeToString(value: number): string {
  if (value >= 1000) {
    return `${value / 1000} L`;
  } else {
    return `${value} ml`;
  }
}

export function timeToString(value: number): string {
  let result = '';
  const date = new Date(0);
  date.setSeconds(value);
  const day = date.getUTCDate() - 1;
  const hour = date.getUTCHours();
  const m = date.getUTCMinutes();
  const s = date.getUTCSeconds();
  if (day > 0) {
    result += day.toString() + ' d';
  }
  if (hour > 0) {
    result += hour.toString() + ' h';
  }
  if (m > 0) {
    result += m.toString() + ' m';
  }
  if (s > 0) {
    result += s.toString() + ' s';
  }
  return result;
}

export function isItem(jsonType: string): boolean {
  return itemJsonTypes.includes(jsonType);
}
