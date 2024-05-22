import { get } from '@src/shared/storages/idb-keyval';
import { AllDestinyManifestComponents } from 'bungie-api-ts/destiny2/manifest';

const manifestKey = 'd2-manifest';

export async function getManifest(): Promise<AllDestinyManifestComponents> {
  return await get<AllDestinyManifestComponents>(manifestKey);
}
