import { JsonItem } from '../JsonItem';

export interface JsonItemSet {
  versionId: string;
  jsonItems: JsonItem[];
}

export interface JsonItemSetEntity {
  versionId: string;
  jsonItems: string;
}

export function convertToJsonItemEnrity(jsonItemSet: JsonItemSet): JsonItemSetEntity {
  return {
    versionId: jsonItemSet.versionId,
    jsonItems: JSON.stringify(jsonItemSet.jsonItems),
  };
}

export function convertToJsonItem(jsonItemSetEntity: JsonItemSetEntity): JsonItemSet {
  return {
    versionId: jsonItemSetEntity.versionId,
    jsonItems: JSON.parse(jsonItemSetEntity.jsonItems),
  };
}
