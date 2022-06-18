const fs = require("fs");

const saveFollowing = (following) => {
  const path = "./data/following.json";

  try {
    if (fs.existsSync(path)) {
      //file exists
      console.log('Following data already saved... overwrite? (y/n)')
    } else {
      fs.writeFile(
        path,
        JSON.stringify(following),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  saveFollowing
}
