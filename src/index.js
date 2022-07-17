require("dotenv").config();
const process = require("process");
const { compareFollows, getNotFollowing } = require("./utils/follows");
const { renderProfiles } = require("./views/profile");
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

    const command = process.argv[2];

    if (!commands[command]) {
        throw "Invalid Command"
    }
    console.log("Initializing Instagram client");
    const igClient = await getClient();
    console.log("Client initialized");

    switch (command) {
        case commands.COMPARE:
            const {follows, unfollows} = await compareFollows(igClient);
            await renderProfiles(follows, {
              label: "follower"
            });
            await renderProfiles(unfollows, {
              label: "unfollower"
            });
            break;
        case commands.NOTFRIENDS:
            const  notFollowing  = await getNotFollowing(igClient)
            await renderProfiles(notFollowing, {
              label: "notfollowing"
            })
            break;
        default:
            return;
    }
};
