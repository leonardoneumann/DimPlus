//import { BungieMembershipType } from 'bungie-api-ts/destiny2';

export async function getCurrentUserProfile() {
  let profiles;

  try {
    profiles = await this.getUserProfiles();
  } catch (err) {
    console.log(err);
  }

  if (profiles?.length > 0) {
    return {
      id: profiles[0].membershipId,
      platform: profiles[0].membershipType,
    };
  } else {
    return null;
  }
}
