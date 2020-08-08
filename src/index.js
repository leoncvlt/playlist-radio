import "./styles.scss";

const authorLabel = document.getElementById("author");
const titleLabel = document.getElementById("title");
const background = document.getElementById("background");

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=10";
const DEFAULT_URL = "https://www.youtube.com/watch?v=RPfFhfSuUZ4&list=PL8F6B0753B2CCA128";

const params = new URLSearchParams(window.location.search);
const playlistId = params.get("list");
if (playlistId) {
  document.getElementById("import").style.display = "none";
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
  background.style.backgroundImage = `url("${DEFAULT_BG}")`;
  authorLabel.innerText = "Paste a youtube playlist URL to get started!";
  document.getElementById("record").style.webkitAnimationPlayState = "paused";
  document.getElementById("import").style.display = "block";
  document.getElementById("controls").style.visibility = "hidden";

  const input = document.getElementById("input-url");
  input.placeholder = DEFAULT_URL;

  document.getElementById("btn-import").addEventListener("click", () => {
    if (!input.value) input.value = input.placeholder;
    const parsedList = new URLSearchParams(input.value).get("list");
    if (parsedList) {
      window.location.search = `&list=${parsedList}`;
    } else {
      alert(
        "No playlist ID found! Are you sure you entered a playlist URL," +
          " or the URL of a video which is part of a playlist?"
      );
    }
  });
}

let initialized = false;

window.onYouTubeIframeAPIReady = function () {
  // eslint-disable-next-line no-undef
  new YT.Player("youtube-player", {
    height: "100%",
    width: "100%",
    host: "https://www.youtube-nocookie.com",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      listType: "playlist",
      list: playlistId,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
};

function onPlayerReady(event) {
  const player = event.target;

  document.getElementById("btn-prev").addEventListener("click", () => {
    player.previousVideo();
  });
  document.getElementById("btn-next").addEventListener("click", () => {
    player.nextVideo();
  });
  const volumeControl = document.getElementById("input-volume");
  volumeControl.onchange = volumeControl.oninput = function () {
    player.setVolume(this.value);
  };

  setTimeout(() => {
    // eslint-disable-next-line no-undef
    if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
      authorLabel.innerText =
        "If the audio doesn't play automatically, press the play button to tune in!";
    }
  }, 1000);

  player.playVideo();
}

function onPlayerStateChange(event) {
  const player = event.target;

  // eslint-disable-next-line no-undef
  if (event.data == YT.PlayerState.PLAYING) {
    if (!initialized) {
      initialized = true;
      player.setShuffle(true);
      document.getElementById("player").style.pointerEvents = "none";
    }

    const videoId = player.getPlaylist()[player.getPlaylistIndex()];
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
      .then(function (response) {
        if (response.status !== 200) {
          console.warn(`Fetch Error - Status Code: ${response.status}`);
          return;
        }

        response.json().then((data) => {
          const tokens = data.title.split("-");
          const title = tokens.length ? tokens[tokens.length - 1] : tokens[0];
          const author = tokens.length ? tokens.slice(0, -1).join("-") : "";

          authorLabel.innerText = author;
          titleLabel.innerText = title;

          const img = new Image();
          img.src = data.thumbnail_url;
          img.onload = () =>
            setTimeout(() => {
              background.style.backgroundImage = `url("${data.thumbnail_url}")`;
            }, 100);
        });
      })
      .catch(function (err) {
        console.warn("Fetch Error", err);
      });
  }
}

function onPlayerError(event) {
  console.warn("Error loading the playlist", event);
  authorLabel.innerText = "Error loading the playlist";
}
