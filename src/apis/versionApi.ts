import { api } from 'boot/axios';
import { API_VERSION, HOST } from 'src/constants/apiConstant';
import { Version } from 'src/types/Version';

export async function getVersions(): Promise<Version[]> {
  const response = await api.get(`${HOST}/${API_VERSION}/versions`);
  return response.data;
}
