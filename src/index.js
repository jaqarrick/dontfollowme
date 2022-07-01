require("dotenv").config();
const process = require("process");
const { compareFollows } = require("./utils/followers");

const { renderProfiles } = require("./views/profile");
const { saveFollowing } = require("./utils/following");
const getClient = require("./utils/client");

const { commands } = require("./constants");

const service = {
    main,
};

module.exports = service;
async function main() {
    (async () => {
        try {
            await executeCommand();
            return;
        } catch (e) {
            console.error(e);
        }
    })();
}

const executeCommand = async (argv) => {
    console.log("Initializing Instagram client");
    const igClient = await getClient();
    console.log("Client initialized");
    const command = process.argv[2];

    switch (command) {
        case commands.COMPARE:
            await compareFollows(igClient);
            await renderProfiles("new-followers");
            await renderProfiles("new-unfollowers");
            break;
        case commands.NOTFRIENDS:
            break;
        default:
            return "Invalid command!";
    }
};
