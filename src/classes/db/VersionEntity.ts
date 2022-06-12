import { Version } from 'src/classes';

export interface VersionEntity {
  id: string;
  releaseId: string;
  releaseDescribe: string;
  targetCommit: string;
  branch: number;
  createDate: number;
  publishDate: number;
  tagName: string;
  tagMessage: string;
  tagDate: number;
  jsonUrls: string;
  languages: string;
}

export function convertToVersionEntity(version: Version): VersionEntity {
  return {
    id: version.id,
    releaseId: version.releaseId,
    releaseDescribe: version.releaseDescribe,
    targetCommit: version.targetCommit,
    branch: version.branch,
    createDate: version.createDate,
    publishDate: version.publishDate,
    tagName: version.tagName,
    tagMessage: version.tagMessage,
    tagDate: version.tagDate,
    jsonUrls: JSON.stringify(version.jsonUrls),
    languages: JSON.stringify(version.languages),
  };
}

export function convertToVersion(versionentity: VersionEntity): Version {
  return {
    id: versionentity.id,
    releaseId: versionentity.releaseId,
    releaseDescribe: versionentity.releaseDescribe,
    targetCommit: versionentity.targetCommit,
    branch: versionentity.branch,
    createDate: versionentity.createDate,
    publishDate: versionentity.publishDate,
    tagName: versionentity.tagName,
    tagMessage: versionentity.tagMessage,
    tagDate: versionentity.tagDate,
    jsonUrls: JSON.parse(versionentity.jsonUrls),
    languages: JSON.parse(versionentity.languages),
  };
}
