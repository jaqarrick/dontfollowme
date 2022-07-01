const fs = require("fs");
const { interactions, errors } = require("../constants");
/**
 * Source: https://github.com/dilame/instagram-private-api/issues/969#issuecomment-551436680
 * @param feed
 * @returns All items from the feed
 */
const getAllItemsFromFeed = async (feed) => {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
};

const writeDataToFile = (fileName, data) => {
    fs.writeFile(`./data/${fileName}.json`, JSON.stringify(data), (err) => {
        if (err) console.error(err);
    });
};

const determineTypeOfFollowFromFileName = (fileType) => {
    switch (fileType) {
        case "new-unfollowers":
            return interactions.UNFOLLOWER;
        case "new-followers":
            return interactions.FOLLOWER;
        default: {
            console.error(errors.invalidFileType);
        }
    }
};

parseData = (filePath) => {
    const data = fs.readFileSync(filePath, (err) => {
        console.error(err);
    });
    return JSON.parse(data);
};

module.exports = {
    getAllItemsFromFeed,
    writeDataToFile,
    determineTypeOfFollowFromFileName,
    parseData,
};
