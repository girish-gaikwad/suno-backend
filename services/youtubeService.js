const axios = require("axios");
const fs = require("fs");
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

async function searchVideos(songName, artistName, maxResults) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing YOUTUBE_API_KEY");
    err.statusCode = 500;
    throw err;
  }

  const query = `${songName} ${artistName}`;

  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        type: "video",
        maxResults,
        q: query,
        key: apiKey,
      },
      timeout: 10000,
    });

    // fs.writeFileSync("youtube_response.json", JSON.stringify(response.data, null, 2)); // Save response to a file for debugging

    const items = response.data && response.data.items ? response.data.items : [];
    return items.map((item) => ({
      videoId: item.id && item.id.videoId ? item.id.videoId : "",
      title: item.snippet && item.snippet.title ? item.snippet.title : "",
      channelTitle:
        item.snippet && item.snippet.channelTitle
          ? item.snippet.channelTitle
          : "",
      publishedAt:
        item.snippet && item.snippet.publishedAt
          ? item.snippet.publishedAt
          : "",
    }));
  } catch (error) {
    const err = new Error("YouTube API request failed");
    err.statusCode = 502;
    err.details = error.response ? error.response.data : undefined;
    throw err;
  }
}

module.exports = {
  searchVideos,
};
