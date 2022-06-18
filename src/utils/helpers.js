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
  }

  module.exports = {
    getAllItemsFromFeed
  }