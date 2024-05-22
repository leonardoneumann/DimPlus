import { DestinyItemComponent, DestinyProfileResponse } from 'bungie-api-ts/destiny2';
import { get } from '@src/shared/storages/idb-keyval';

const dimLastMembershipIdKey = 'dim-last-membership-id';
const dimProfileKey = membershipId => `profile-${membershipId}`;

export async function getCurrentProfileInventory(): Promise<DestinyItemComponent[]> {
  const membershipId = window.localStorage.getItem(dimLastMembershipIdKey);
  const profile = await get<DestinyProfileResponse>(dimProfileKey(membershipId));

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
    console.error('[Dim+] found 0 or more than 1 item for a given IID');
  } else {
    return foundItems[0];
  }
}
