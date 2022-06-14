import { CddaSubItem } from 'src/classes';
import { AbstractCddaSubItemVersionFactory } from 'src/classes/factory/cddaSubItem/AbstractCddaSubItemFactory';
import { CddaItemRef, GettextString, Length, Time, Volume, Weight } from 'src/classes/items';
import { getOptionalUnknown, initCddaSubItemByJson } from './base';

export function getOptionalCddaSubItem<T extends CddaSubItem>(
  jsonObject: unknown,
  key: string,
  ins: T,
  ...extend: unknown[]
): T | undefined {
  const optionalUnknown = getOptionalUnknown(jsonObject, key);
  return initCddaSubItemByJson(optionalUnknown, ins, ...extend);
}

export function getCddaSubItem<T extends CddaSubItem>(
  jsonObject: unknown,
  key: string,
  def: T,
  ...extend: unknown[]
): T {
  return getOptionalCddaSubItem(jsonObject, key, def, ...extend) ?? def;
}

export function getOptionalCddaSubItemUseVersionFactory(
  jsonObject: unknown,
  key: string,
  factory: AbstractCddaSubItemVersionFactory,
  ...extend: unknown[]
): CddaSubItem | undefined {
  const cddaSubItem = factory.getProduct();
  return getOptionalCddaSubItem(jsonObject, key, cddaSubItem, ...extend);
}

export function getCddaSubItemUseVersionFactory(
  jsonObject: unknown,
  key: string,
  factory: AbstractCddaSubItemVersionFactory,
  ...extend: unknown[]
): CddaSubItem {
  const cddaSubItem = factory.getProduct();
  return getCddaSubItem(jsonObject, key, cddaSubItem, ...extend);
}

export function getOptionalCddaItemRef(jsonObject: unknown, key: string, jsonType: string) {
  return getOptionalCddaSubItem<CddaItemRef>(jsonObject, key, new CddaItemRef(), jsonType);
}

export function getCddaItemRef(jsonObject: unknown, key: string, jsonType: string, def?: CddaItemRef) {
  return getCddaSubItem<CddaItemRef>(jsonObject, key, def ?? new CddaItemRef(), jsonType);
}

export function getOptionalGettextString(jsonObject: unknown, key: string, ctx?: string) {
  return getOptionalCddaSubItem<GettextString>(jsonObject, key, new GettextString(), ctx);
}

export function getGettextString(jsonObject: unknown, key: string, ctx?: string, def?: GettextString) {
  return getCddaSubItem<GettextString>(jsonObject, key, def ?? new GettextString(), ctx);
}

export function getOptionalVolume(jsonObject: unknown, key: string, mult?: number) {
  return getOptionalCddaSubItem<Volume>(jsonObject, key, new Volume(), mult);
}

export function getVolume(jsonObject: unknown, key: string, mult?: number, def?: Volume) {
  return getCddaSubItem<Volume>(jsonObject, key, def ?? new Volume(), mult);
}

export function getOptionalWeight(jsonObject: unknown, key: string, mult?: number) {
  return getOptionalCddaSubItem<Weight>(jsonObject, key, new Weight(), mult);
}

export function getWeight(jsonObject: unknown, key: string, mult?: number, def?: Weight) {
  return getCddaSubItem<Weight>(jsonObject, key, def ?? new Weight(), mult);
}

export function getOptionalLength(jsonObject: unknown, key: string, mult?: number) {
  return getOptionalCddaSubItem<Length>(jsonObject, key, new Length(), mult);
}

export function getLength(jsonObject: unknown, key: string, mult?: number, def?: Length) {
  return getCddaSubItem<Length>(jsonObject, key, def ?? new Length(), mult);
}

export function getOptionalTime(jsonObject: unknown, key: string, mult?: number) {
  return getOptionalCddaSubItem<Time>(jsonObject, key, new Time(), mult);
}

export function getTime(jsonObject: unknown, key: string, mult?: number, def?: Time) {
  return getCddaSubItem<Time>(jsonObject, key, def ?? new Time(), mult);
}
