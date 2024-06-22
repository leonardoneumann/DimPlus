import { RollCombos, RollData } from '@root/src/scrapers/lightgg'
import { DestinyItemComponent } from 'bungie-api-ts/destiny2'
import { getD2ManifestItemDefinition } from '@root/src/dim/storage/d2manifest'
import { getItemInstanceComponentByIID } from '@root/src/dim/storage/inventory'

const bungieNetPath = (src: string): string => `https://www.bungie.net${src}`

export class ItemInfo {
  rollsCommunityAvg?: RollData[]
  rollCombos?: RollCombos
  component: DestinyItemComponent

  hash: number
  instanceId: string

  //manifest / insntace properties
  displayName: string
  level: number
  icon: string

  constructor(component: DestinyItemComponent, rollsCommunityAvgData?: RollData[], rollCombos?: RollCombos) {
    this.component = component
    this.rollsCommunityAvg = rollsCommunityAvgData
    this.rollCombos = rollCombos

    this.hash = component.itemHash
    this.instanceId = component.itemInstanceId
  }
}

export async function createItemInfo(
  component: DestinyItemComponent,
  rollsCommunityAvgData?: RollData[],
  rollCombos?: RollCombos,
): Promise<ItemInfo> {
  const info = new ItemInfo(component, rollsCommunityAvgData, rollCombos)

  const manifest = await getD2ManifestItemDefinition(this.hash)
  info.displayName = manifest.displayProperties.name
  info.icon = bungieNetPath(manifest.displayProperties.icon)

  const instance = await getItemInstanceComponentByIID(this.instanceId)
  info.level = instance.itemLevel

  return info
}

export default ItemInfo
