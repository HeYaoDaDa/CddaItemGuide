import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
import { Version } from 'src/classes';

/**
 * abstract version factory class
 */
export abstract class AbstractVersionFactory<T extends object> {
  /**
   * get product by param
   * @param version param
   */
  getProduct(): T {
    const versionId = useUserConfigStore().versionId;
    const currentVersion = useConfigOptionsStore().findVersionById(versionId);
    if (currentVersion) return this.doGetProduct(currentVersion);
    else throw new Error(`not find current version by id ${versionId}`);
  }

  abstract doGetProduct(version: Version): T;
}
