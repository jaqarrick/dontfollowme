const { IgApiClient } = require("instagram-private-api");

const getClient = async () => {
    const username = process.env.IG_USERNAME;
    const password = process.env.IG_PASSWORD;
    if (!username || !password) {
        throw "Username or password not provided";
    }
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();

    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    return ig;
};

module.exports = getClient;
