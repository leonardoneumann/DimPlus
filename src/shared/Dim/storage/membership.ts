import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';
const membershipIdStorageKey = 'dim-last-membership-id';

type MembershipStorage = BaseStorage<string>;

export const MembershipStorage: MembershipStorage = {
  ...createStorage<string>(membershipIdStorageKey, null, {
    storageType: StorageType.Local,
    //liveUpdate: true,
    //sessionAccessForContentScripts: true
  }),
};

const destinyVersionKey = 'dim-last-destiny-version';

type DestinyVersionStorage = BaseStorage<string>;

export const DestinyVersionStorage: DestinyVersionStorage = {
  ...createStorage<string>(destinyVersionKey, null, {
    storageType: StorageType.Local,
    //liveUpdate: true,
    //sessionAccessForContentScripts: true
  }),
};
