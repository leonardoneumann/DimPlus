import { MetaCombos, PlugMetaUsageData } from '@root/src/scrapers/lightgg'
import { DestinyItemComponent } from 'bungie-api-ts/destiny2'
import { getD2Manifest } from '@root/src/dim/storage/d2manifest'
import { getProfileItemComponents } from '@root/src/dim/storage/profile'

const bungieNetPath = (src: string): string => `https://www.bungie.net${src}`

//plugs/perks
export interface PlugDisplayData {
  hash: number
  name: string
  icon: string

  metaUsage: PlugMetaUsageData
  position: [col: number, row: number]
}

export interface ItemInfo {
  component: DestinyItemComponent
  metaCombos?: MetaCombos

  hash: number
  instanceId: string

  //manifest / insntace properties
  displayName?: string
  icon?: string
  plugDisplayData: PlugDisplayData[]
  level?: number
}

export async function createItemInfo(
  component: DestinyItemComponent,
  plugMetaUsageData?: PlugMetaUsageData[],
  metaCombos?: MetaCombos,
): Promise<ItemInfo> {
  const info: ItemInfo = {
    component: component,
    hash: component.itemHash,
    instanceId: component.itemInstanceId,
    plugDisplayData: [],
  }

  const manifest = await getD2Manifest()
  const itemDefinition = manifest.DestinyInventoryItemDefinition[info.hash]

  info.displayName = itemDefinition.displayProperties.name
  info.icon = bungieNetPath(itemDefinition.displayProperties.icon)

  const profileComponents = await getProfileItemComponents()
  const itemInstanceComponent = profileComponents.instances.data?.[info.instanceId]
  info.level = itemInstanceComponent.itemLevel

  //const sockets = profileComponents.sockets.data?.[info.instanceId].sockets

  //const plugObjectives = profileComponents.plugObjectives.data?.[info.instanceId].objectivesPerPlug

  const plugs = profileComponents.reusablePlugs.data?.[info.instanceId].plugs

  //random rolls are only on columns 1 through 4
  for (let colIndex = 1; colIndex <= 4; colIndex++) {
    plugs[colIndex].map((plug, rowIndex) => {
      console.log(`col: ${colIndex} - row: ${rowIndex} - hash ${plug.plugItemHash}`)

      const displayProperties = manifest.DestinyInventoryItemDefinition[plug.plugItemHash]?.displayProperties

      const metaUsage = plugMetaUsageData.filter(rollMetaData => rollMetaData.perkId === plug.plugItemHash)[0]

      info.plugDisplayData.push({
        hash: plug.plugItemHash,
        name: displayProperties.name,
        icon: bungieNetPath(displayProperties.icon),
        metaUsage: metaUsage,
        position: [colIndex - 1, rowIndex],
      })
    })
  }

  info.metaCombos = metaCombos

  for (let comboIndex = 0; comboIndex < info.metaCombos.combos.length; comboIndex++) {
    const foundFirst = info.plugDisplayData.find(c => c.hash === metaCombos.combos[comboIndex].ids[0])
    const foundSecond = info.plugDisplayData.find(c => c.hash === metaCombos.combos[comboIndex].ids[1])

    if (foundFirst && foundSecond) {
      metaCombos.combos[comboIndex].haveCombo = true
    }
  }

  return info
}

export default ItemInfo
