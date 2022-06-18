require("dotenv/config");
const fs = require("fs");
const { IgApiClient } = require("instagram-private-api");

const {
  saveFollowers,
  getFollowers,
  checkUnfollows,
} = require("./utils/followers");

const { renderProfiles } = require("./views/profile");
const { saveFollowing } = require("./utils/following");

const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);

(async () => {

  try {
    await renderProfiles()
  } catch(e) {
    console.log(e)
  }
  // 
  // await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  //   const followers = await getFollowers(ig);
  //   console.log(followers, "followers");
  // await checkUnfollows(ig);
  //   const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
  //   const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);

  //   const followers = await getAllItemsFromFeed(followersFeed);
  //   const following = await getAllItemsFromFeed(followingFeed);

  //   saveFollowers(followers)
  //   saveFollowing(following)
  return;
  // Making a new map of users username that follow you.
  const followersUsername = new Set(followers.map(({ username }) => username));
  // Filtering through the ones who aren't following you.
  const notFollowingYou = following.filter(
    ({ username }) => !followersUsername.has(username)
  );
  //   const content = notFollowingYou.map((account) => ({
  //     username: account.username,
  //     avatar_url: account.profile_pic_url,
  //   }));

  //   fs.writeFile("./data/followers.json", JSON.stringify(followers), (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });

  //   fs.writeFile("./data/following.json", JSON.stringify(following), (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   });
  // Looping through and unfollowing each user
  // for (const user of notFollowingYou) {
  //   // await ig.friendship.destroy(user.pk);
  //   console.log(`unfollowed ${user.username}`);
  //   /*
  //       Time, is the delay which is between 1 second and 7 seconds.
  //       Creating a promise to stop the loop to avoid api spam
  //    */
  //   const time = Math.round(Math.random() * 6000) + 1000;
  //   await new Promise(resolve => setTimeout(resolve, time));
  // }
})();

/**
 * Source: https://github.com/dilame/instagram-private-api/issues/969#issuecomment-551436680
 * @param feed
 * @returns All items from the feed
 */

async function getAllItemsFromFeed(feed) {
  let items = [];
  do {
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable());
  return items;
}
