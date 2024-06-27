import { DestinyItemComponent, DestinyItemComponentSetOfint64, DestinyProfileResponse } from 'bungie-api-ts/destiny2'
import { get } from '@src/shared/storages/idb-keyval'

const dimLastMembershipIdKey = 'dim-last-membership-id'
const dimProfileKey = membershipId => `profile-${membershipId}`

async function getCurrentUserProfile(): Promise<DestinyProfileResponse> {
  const membershipId = window.localStorage.getItem(dimLastMembershipIdKey)
  return await get<DestinyProfileResponse>(dimProfileKey(membershipId))
}

export async function getFullInventoryFlat(): Promise<DestinyItemComponent[]> {
  const profile = await getCurrentUserProfile()

  return [
    ...Object.values(profile.characterEquipment.data)
      .map(inventory => inventory.items)
      .flat(),
    ...Object.values(profile.characterInventories.data)
      .map(inventory => inventory.items)
      .flat(),
    ...profile.profileInventory.data.items,
  ]
}

export async function searchItemComponetByIID(iid: string): Promise<DestinyItemComponent> {
  const profile = await getCurrentUserProfile()

  for (const characterKey in profile.characterInventories.data) {
    for (const item of profile.characterInventories.data[characterKey].items) {
      if (item.itemInstanceId === iid) {
        return item
      }
    }

    for (const item of profile.characterEquipment.data[characterKey].items) {
      if (item.itemInstanceId === iid) {
        return item
      }
    }
  }

  for (const item of profile.profileInventory.data.items) {
    if (item.itemInstanceId === iid) {
      return item
    }
  }

  profile.itemComponents.instances.data?.[iid]

  return null
}

export async function getProfileItemComponents(): Promise<DestinyItemComponentSetOfint64> {
  const profile = await getCurrentUserProfile()

  return profile.itemComponents
}
