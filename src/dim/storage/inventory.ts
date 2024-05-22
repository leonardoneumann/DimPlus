//import { getD2Manifest } from "./d2manifest";
import { LastMembershipStorage } from './membership';
import { DestinyItemComponent, DestinyProfileResponse } from 'bungie-api-ts/destiny2';
import { get } from '@src/shared/storages/idb-keyval';

export async function getCurrentProfileInventory(): Promise<DestinyItemComponent[]> {
  const membershipId = await LastMembershipStorage.get();

  const profile = await get<DestinyProfileResponse>(`profile-${membershipId}`);

  return [
    ...Object.values(profile.characterEquipment.data)
      .map(inventory => inventory.items)
      .flat(),
    ...Object.values(profile.characterInventories.data)
      .map(inventory => inventory.items)
      .flat(),
  ];
}

export async function getItemFromIID(iid: string): Promise<DestinyItemComponent> {
  const inventory = await getCurrentProfileInventory();

  const foundItems = inventory.filter(it => it.itemInstanceId === iid);

  if (foundItems.length !== 1) {
    console.log('found 0 or more than 1 item for a given IID');
  } else {
    return foundItems[0];
  }
}
