import { get } from '@src/shared/storages/idb-keyval'
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2'
import { AllDestinyManifestComponents } from 'bungie-api-ts/destiny2/manifest'

const manifestKey = 'd2-manifest'

export async function getD2Manifest(): Promise<AllDestinyManifestComponents> {
  return await get<AllDestinyManifestComponents>(manifestKey)
}

export async function getD2ManifestItemDefinition(itemHash: number): Promise<DestinyInventoryItemDefinition> {
  const manifest = await getD2Manifest()

  return manifest.DestinyInventoryItemDefinition[itemHash]
}
