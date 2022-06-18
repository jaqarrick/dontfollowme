const fs = require("fs");
const { getAllItemsFromFeed } = require("./helpers");
const path = "./data/followers.json";

const saveFollowers = (followers) => {
  try {
    if (fs.existsSync(path)) {
      //file exists
      console.log("Followers data already saved... overwrite? (y/n)");
    } else {
      fs.writeFile(path, JSON.stringify(followers), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getFollowers = async (igClient) => {
  // check if we've already saved this list
  try {
    if (fs.existsSync(path)) {
      //file exists
      console.log("Followers data already saved... overwrite? (y/n)");
      const data = fs.readFileSync(path, (err) => {
        console.error(err);
      });
      return JSON.parse(data);
      // prompt something
      const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
      const followers = await getAllItemsFromFeed(followersFeed);
      saveFollowers(followers);
    } else {
      fs.writeFile(path, JSON.stringify(followers), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const checkUnfollows = async (igClient) => {
  // First get the saved list of followers
  const savedData = fs.readFileSync(path, (err) => {
    console.error(err);
  });
  const savedFollowers = JSON.parse(savedData);
  // Now get up to date followers list
  const currentFollowers = await getCurrentFollowers(igClient);

  const newFollowers = currentFollowers.filter(
    (current) =>
      !savedFollowers.some((saved) => saved.username == current.username)
  );

  const newUnfollowers = savedFollowers.filter(
    (saved) =>
      !currentFollowers.some((current) => saved.username == current.username)
  );
  fs.writeFile(
    "./data/profiles.json",
    JSON.stringify(
      newFollowers.map(({ username, profile_pic_url }) => ({
        username,
        profile_pic_url,
      }))
    ),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  //Find values that are in result1 but not in result2
  // var uniqueResultOne = result1.filter(function(obj) {
  //   return !result2.some(function(obj2) {
  //       return obj.value == obj2.value;
  //   });
  // });

  // //Find values that are in result2 but not in result1
  // var uniqueResultTwo = result2.filter(function(obj) {
  //   return !result1.some(function(obj2) {
  //       return obj.value == obj2.value;
  //   });
  // });
};

const getCurrentFollowers = async (igClient) => {
  const followersFeed = igClient.feed.accountFollowers(
    igClient.state.cookieUserId
  );
  const followers = await getAllItemsFromFeed(followersFeed);
  return followers;
};

module.exports = {
  saveFollowers,
  getFollowers,
  checkUnfollows,
};
