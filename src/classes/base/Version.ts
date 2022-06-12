export interface Version {
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
  jsonUrls: string[];
  languages: { code: string; urls: string[] }[];
}
