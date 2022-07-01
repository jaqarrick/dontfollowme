const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = "./data/profiles.json";
const { curly } = require("node-libcurl");
const { determineTypeOfFollowFromFileName } = require("../utils/helpers");
const terminalImagePromise = import("terminal-image");

const printProfile = async (url, username, typeOfFollow) => {
    try {
        const terminalImage = await terminalImagePromise;
        const { statusCode, data } = await curly.get(url);

        if (statusCode !== 200) throw "Failed to fetch profile url";
        console.log(username, typeOfFollow);
        console.log(
            await terminalImage.default.buffer(data, {
                width: 10,
                height: 10,
                preserveAspectRatio: false,
            }),
        );
        return;
    } catch (err) {
        console.error(err);
    }
};

const renderProfiles = async (fileName) => {
    try {
        const filePath = `./data/${fileName}.json`;
        const typeOfFollow = determineTypeOfFollowFromFileName(fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`${fileName} data does not exist yet`);
            return;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                throw err;
            }
            const profiles = JSON.parse(data);
            console.log(`You have ${profiles.length} new ${typeOfFollow}`);
            profiles.forEach(async (profile) => {
                const { profile_pic_url: url, username } = profile;
                await printProfile(url, username, typeOfFollow);
            });
        });
        return;
    } catch (e) {
        console.log(e);
    }
};

module.exports = { renderProfiles };
