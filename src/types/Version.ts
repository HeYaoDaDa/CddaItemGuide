export interface Version {
  id: string;
  releaseId: string;
  releaseDescribe: string;
  targetCommit: string;
  branch: number;
  createDate: Date;
  publishDate: Date;
  tagName: string;
  tagMessage: string;
  tagDate: Date;
  jsonUrls: string[];
  languages: { code: string; urls: string[] }[];
}
