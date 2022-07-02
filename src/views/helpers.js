const chunkArray = (arr, n) => {
    var chunkLength = Math.max(arr.length / n, 1);
    var chunks = [];
    for (var i = 0; i < n; i++) {
        if (chunkLength * (i + 1) <= arr.length)
            chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
    }
    return chunks;
};

const determineNumChunks = (l) => {
    const chunkMaxLength = 10;
    // we want each chunk to contain 10 or less items
    // length / maxChunkLength
    return Math.ceil(l / chunkMaxLength);
};

module.exports = {
    determineNumChunks,
    chunkArray,
};
