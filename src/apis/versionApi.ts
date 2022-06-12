import { api } from 'boot/axios';
// import { API_VERSION, HOST } from 'src/constants/apiConstant';
import { Version } from 'src/classes/base/Version';

export async function getVersions(): Promise<Version[]> {
  // const response = await api.get(`${HOST}/${API_VERSION}/versions`);
  //TODO: Dummy url
  const response = await api.get('https://raw.githubusercontent.com/HeYaoDaDa/CddaFile/master/versions.json');
  return response.data;
}
