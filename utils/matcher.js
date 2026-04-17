function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreTitle(title, song) {
  const titleNorm = normalize(title);
  const nameNorm = normalize(song.name);
  const artistNorm = normalize(song.artist);

  let score = 0;
  if (titleNorm.includes(nameNorm)) score += 5;
  if (titleNorm.includes(artistNorm)) score += 3;
  if (titleNorm.includes("official")) score += 2;
  if (titleNorm.includes("audio")) score += 1;
  if (titleNorm.includes("live")) score -= 1;

  return score;
}

function pickBestVideo(videos, song) {
  if (!Array.isArray(videos) || !videos.length) return null;

  let best = videos[0];
  let bestScore = scoreTitle(best.title, song);

  for (let i = 1; i < videos.length; i += 1) {
    const current = videos[i];
    const currentScore = scoreTitle(current.title, song);
    if (currentScore > bestScore) {
      best = current;
      bestScore = currentScore;
    }
  }

  return bestScore > 0 ? best : videos[0];
}

module.exports = {
  pickBestVideo,
};
