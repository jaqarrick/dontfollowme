const fs = require("fs");
const getClient = require("./client");
const { getAllItemsFromFeed, writeDataToFile } = require("./helpers");
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

const parseFollowers = () => {
    const data = fs.readFileSync(path, (err) => {
        console.error(err);
    });
    return JSON.parse(data);
};

const getFollowers = async (igClient) => {
    // check if we've already saved this list
    try {
        if (fs.existsSync(path)) {
            //file exists
            return parseFollowers();
        } else {
            console.log("Followers data does not exist yet. Fetching it now");
            const followersFeed = igClient.feed.accountFollowers(
                igClient.state.cookieUserId,
            );
            followers = await getAllItemsFromFeed(followersFeed);
            writeDataToFile("followers", followers);
            return null;
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

    if (!savedFollowers) {
        console.log(
            "Followers can't be compared because you didn't have any saved followers. Try again later.",
        );
        return;
    }

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
    writeDataToFile("new-followers", newFollowers);
    writeDataToFile("new-unfollowers", newUnfollowers);
};

const getCurrentFollowers = async (igClient) => {
    const followersFeed = igClient.feed.accountFollowers(
        igClient.state.cookieUserId,
    );
    const followers = await getAllItemsFromFeed(followersFeed);
    return followers;
};

module.exports = {
    saveFollowers,
    getFollowers,
    compareFollows,
};

// const newFollowers = currentFollowers
//     .filter(
//         (current) =>
//             !savedFollowers.some(
//                 (saved) => saved.username == current.username
//             )
//     )
//     .map(({ username, profile_pic_url }) => ({
//         username,
//         profile_pic_url,
//     }));

// const newUnfollowers = savedFollowers
//     .filter(
//         (saved) =>
//             !currentFollowers.some(
//                 (current) => saved.username == current.username
//             )
//     )
//     .map(({ username, profile_pic_url }) => ({
//         username,
//         profile_pic_url,
//     }));
