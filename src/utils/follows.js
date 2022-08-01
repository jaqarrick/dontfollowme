const fs = require("fs");
const getClient = require("./client");
const {
    getAllItemsFromFeed,
    writeDataToFile,
    parseData,
} = require("./helpers");

const followersPath = "./data/followers.json";
const followingPath = "./data/following.json";

const getFollowing = async (igClient) => {
    // check if we've already saved this list
    try {
        if (fs.existsSync(followingPath)) {
            //file exists
            return parseData(followingPath);
        } else {
            console.log("Followers data does not exist yet. Fetching it now");
            const followingFeed = igClient.feed.accountFollowing(
                igClient.state.cookieUserId,
            );

            const following = await getAllItemsFromFeed(followingFeed);
            writeDataToFile("following", following);
            return null;
        }
    } catch (err) {
        throw err;
    }
};

const getFollowers = async (igClient) => {
    // check if we've already saved this list
    try {
        if (fs.existsSync(followersPath)) {
            //file exists
            return parseData(followersPath);
        } else {
            console.log("Followers data does not exist yet. Fetching it now");
            const followersFeed = igClient.feed.accountFollowers(
                igClient.state.cookieUserId,
            );
            const followers = await getAllItemsFromFeed(followersFeed);
            writeDataToFile("followers", followers);
            return followers;
        }
    } catch (err) {
        throw err;
    }
};

const diffFollowers = (a, b) => {
    return a
        .filter(
            (followerA) =>
                !b.some(
                    (followerB) => followerA.username == followerB.username,
                ),
        )

        .map(({ username, profile_pic_url }) => ({
            username,
            profile_pic_url,
        }));
};

const selectPropsFromFollowers = (followersList, props = []) =>
    followersList.map((follower) => {
        const properties = {};

        props.forEach((prop) => {
            properties[prop] = follower[prop];
        });

        return properties;
    });

const compareFollows = async (igClient) => {
    // First get the saved list of followers
    console.log("Getting saved followers");
    const savedFollowers = await getFollowers(igClient);
    console.log(`You have ${savedFollowers.length} saved followers`);
    // Now get up to date followers list
    console.log("Getting current followers");
    const currentFollowers = await getCurrentFollowers(igClient);
    console.log(`You have ${currentFollowers.length} current followers`);
    const properties = ["username", "profile_pic_url"];
    console.log("Determining new follows");
    const newFollowers = selectPropsFromFollowers(
        diffFollowers(currentFollowers, savedFollowers),
        properties,
    );
    console.log("Determining new unfollows");
    const newUnfollowers = selectPropsFromFollowers(
        diffFollowers(savedFollowers, currentFollowers),
        properties,
    );

    return { follows: newFollowers, unfollows: newUnfollowers };
};

const getNotFollowing = async (igClient) => {
    const following = await getFollowing(igClient);
    const followers = await getFollowers(igClient);

    if(!followers || !following){
        throw "Something went wrong and followers could not be compared. Try again."
    }
    const notFollowing = diffFollowers(following, followers);
    const properties = ["username", "profile_pic_url"];
    console.log("Determining new follows");
    return selectPropsFromFollowers(notFollowing, properties);
};

const getCurrentFollowers = async (igClient) => {
    const followersFeed = igClient.feed.accountFollowers(
        igClient.state.cookieUserId,
    );
    const followers = await getAllItemsFromFeed(followersFeed);
    return followers;
};

module.exports = {
    compareFollows,
    getNotFollowing,
};
