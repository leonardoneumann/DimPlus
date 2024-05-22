import { get } from '@src/shared/storages/idb-keyval';
import { BungieMembershipType } from 'bungie-api-ts/destiny2';

export type DestinyVersion = 1 | 2;

/** A specific Destiny account (one per platform and Destiny version) */
export interface DestinyAccount {
  /** Bungie Name */
  readonly displayName: string;
  /** The platform type this account started on. It may not be exclusive to this platform anymore, but this is what gets used to call APIs. */
  readonly originalPlatformType: BungieMembershipType;
  /** readable platform name */
  readonly platformLabel: string;
  /** Destiny platform membership ID. */
  readonly membershipId: string;
  /** Which version of Destiny is this account for? */
  readonly destinyVersion: DestinyVersion;
  /** All the platforms this account plays on (post-Cross-Save) */
  readonly platforms: BungieMembershipType[];

  /** When was this account last used? */
  readonly lastPlayed: Date;
}

const accountsKey = 'accounts';

export async function getAccounts(): Promise<DestinyAccount[]> {
  return await get<DestinyAccount[] | undefined>(accountsKey);
}
