const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require('fs')
const path = "./data/profiles.json";
const printProfilePhoto = async (url) => {
  try {
    const { stdout, stderr } = await exec(`curl -s ${url} | viu -w 10 -`);
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);
  } catch (err) {
    console.error(err);
  }
};
// lsWithGrep();

const renderProfiles = async () => {
    
try {
    const data = fs.readFileSync(path, (err) => {
        console.error(err);
      });
      const profiles = JSON.parse(data);
      const urls = profiles.map((p) => p.profile_pic_url);
      console.log(urls);
      urls.forEach(async url => {
        await printProfilePhoto(url)
      })
} catch (e) {
    console.log(e)

}
  
  // i need to first get all of the urls
  // make a request to the url and pipe the output into viu
};

module.exports = { renderProfiles };
