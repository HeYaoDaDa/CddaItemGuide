import { itemJsonTypes } from 'src/constants/jsonTypesConstant';

export function itemType2JsonType(itemType: string): string[] {
  if (itemType === 'item') {
    return itemJsonTypes;
  } else {
    return [itemType];
  }
}

export function jsonType2ItemType(jsonType: string): string {
  if (itemJsonTypes.find((itemJsonType) => itemJsonType === jsonType)) {
    return 'item';
  } else {
    return jsonType;
  }
}

export function isItemByjsonType(jsonType: string): boolean {
  return itemJsonTypes.includes(jsonType);
}
