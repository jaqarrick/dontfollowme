const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = "./data/profiles.json";
const { curly } = require("node-libcurl");
const { chunkArray, determineNumChunks } = require("./helpers");
const terminalImagePromise = import("terminal-image");

const printProfile = async (url, username, label) => {
    try {
        const terminalImage = await terminalImagePromise;
        const { statusCode, data } = await curly.get(url);

        if (statusCode !== 200) throw "Failed to fetch profile url";
        console.log(username);
        console.log(label);
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

const renderProfiles = async (profiles, opts = { label: "" }) => {
    // todo, if length is greater than 10 split each group into separate chunks
    const { label } = opts;
    console.log(profiles.length);
    if (profiles.length < 10) {
        profiles.forEach(async (profile) => {
            const { profile_pic_url: url, username } = profile;
            await printProfile(url, username, label);
        });
    } else {
        const chunkedProfiles = chunkArray(
            profiles,
            determineNumChunks(profiles.length),
        );

        chunkedProfiles.forEach(async (list) => {
            await new Promise((resolve) => {
                list.forEach(async (profile) => {
                    const { profile_pic_url: url, username } = profile;
                    await printProfile(url, username, label);
                });
                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        });
    }
};

module.exports = { renderProfiles };
