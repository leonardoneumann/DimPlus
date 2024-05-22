import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';
const lastMembershipIdStorageKey = 'dim-last-membership-id';

type LastMembershipStorage = BaseStorage<string>;

export const LastMembershipStorage: LastMembershipStorage = {
  ...createStorage<string>(lastMembershipIdStorageKey, null, {
    storageType: StorageType.Local,
    //liveUpdate: true,
    //sessionAccessForContentScripts: true
  }),
};

/*
const destinyVersionKey = 'dim-last-destiny-version';

type DestinyVersionStorage = BaseStorage<string>;

export const DestinyVersionStorage: DestinyVersionStorage = {
  ...createStorage<string>(destinyVersionKey, null, {
    storageType: StorageType.Local,
    //liveUpdate: true,
    //sessionAccessForContentScripts: true
  }),
};
*/
