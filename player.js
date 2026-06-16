const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

const players = [...document.querySelectorAll(".audio-player")].map((player) => {
  const audio = new Audio(player.dataset.audio);
  const button = player.querySelector(".play-button");
  const progress = player.querySelector(".progress");
  const time = player.querySelector("time");

  const setProgress = (value) => {
    progress.value = value;
    progress.style.setProperty("--progress", `${value}%`);
  };

  audio.preload = "metadata";

  audio.addEventListener("loadedmetadata", () => {
    time.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    setProgress(value);
    time.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    player.classList.remove("is-playing");
    audio.currentTime = 0;
    setProgress(0);
  });

  audio.addEventListener("error", () => {
    player.classList.remove("is-playing");
    time.textContent = "فایل موجود نیست";
  });

  button.addEventListener("click", async () => {
    if (audio.paused) {
      players.forEach((item) => {
        if (item.audio !== audio) {
          item.audio.pause();
          item.player.classList.remove("is-playing");
        }
      });

      try {
        await audio.play();
        player.classList.add("is-playing");
      } catch {
        time.textContent = "فایل موجود نیست";
      }
    } else {
      audio.pause();
      player.classList.remove("is-playing");
    }
  });

  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    setProgress(progress.value);
  });

  return { audio, player };
});
