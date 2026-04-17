const { exec } = require("child_process");

function getStreamUrl(videoId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const command = `yt-dlp -f bestaudio -g ${url}`;
    console.log(command);

    exec(
      command,
      { timeout: 15000, maxBuffer: 1024 * 1024 },
      (error, stdout) => {
        if (error) {
          const err = new Error("yt-dlp failed to fetch stream URL");
          err.statusCode = 502;
          return reject(err);
        }

        const output = stdout ? stdout.trim() : "";
        const streamUrl = output.split("\n")[0];
        if (!streamUrl) {
          const err = new Error("No stream URL returned by yt-dlp");
          err.statusCode = 502;
          return reject(err);
        }

        return resolve(streamUrl);
      }
    );
  });
}

module.exports = {
  getStreamUrl,
};
