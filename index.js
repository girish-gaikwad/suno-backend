const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const youtubeService = require("./services/youtubeService");
const streamService = require("./services/streamService");
const { pickBestVideo } = require("./utils/matcher");

dotenv.config();

const app = express();
app.use(cors());

const SAMPLE_SONG = {
  name: "Blinding Lights",
  artist: "The Weeknd",
};

function handleError(res, err) {
  const status = err && err.statusCode ? err.statusCode : 500;
  const message = err && err.message ? err.message : "Internal server error";
  res.status(status).json({ error: message });
}

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the YouTube Music Streamer API" });
});

app.get("/search", async (_req, res) => {
  try {
    const query = `${SAMPLE_SONG.name} ${SAMPLE_SONG.artist}`;
    const results = await youtubeService.searchVideos(
      SAMPLE_SONG.name,
      SAMPLE_SONG.artist,
      5
    );

    res.json({ query, results });
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/play", async (_req, res) => {
  try {
    const results = await youtubeService.searchVideos(
      SAMPLE_SONG.name,
      SAMPLE_SONG.artist,
      5
    );

    if (!results.length) {
      return res.status(404).json({ error: "No videos found" });
    }

    const best = pickBestVideo(results, SAMPLE_SONG);
    if (!best) {
      return res.status(404).json({ error: "No matching video found" });
    }

    const streamUrl = await streamService.getStreamUrl(best.videoId);
    console.log("Stream URL obtained:", streamUrl);
    res.json({
      title: SAMPLE_SONG.name,
      artist: SAMPLE_SONG.artist,
      videoId: best.videoId,
      streamUrl,
    });
  } catch (err) {
    handleError(res, err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
