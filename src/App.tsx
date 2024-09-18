import { useState } from "react";
import { getAccessToken, getPlaylistTracks } from "./services/spotifyService";

import "./App.css";
import { getVideoId } from "./services/youtubeService";

function App() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [exportedPlaylist, setExportedPlaylist] = useState("");

  const handlePlaylistUrl = (value: string) => {
    setPlaylistUrl(value);
  };

  const exportPlaylist = async () => {
    const accessToken = await getAccessToken();
    const playlistURL = new URL(playlistUrl);
    const playlisPathname = playlistURL.pathname;
    const playlistID = playlisPathname.split("/").pop();

    if (!playlistID) {
      alert("Invalid playlist URL");
      return;
    }

    const playlistTracks = await getPlaylistTracks(accessToken, playlistID);

    const youtubeTracks = await Promise.all(
      playlistTracks.map(async (track) => {
        return getVideoId(track);
      })
    );

    const youtubePlaylist = `https://www.youtube.com/watch_videos?video_ids=${youtubeTracks.join(
      ","
    )}`;

    setExportedPlaylist(youtubePlaylist);
  };

  return (
    <div className="container">
      <h1 className="mainTitle">
        Transform Spotify playlist into YouTube playlists
      </h1>
      <div className="inputContainer">
        <input
          type="url"
          placeholder="Playlist URL"
          value={playlistUrl}
          onChange={(e) => handlePlaylistUrl(e.target.value)}
          className="input"
        />
        <button className="button" onClick={exportPlaylist}>
          Convert
        </button>
      </div>
      {exportedPlaylist && (
        <p>
          YouTube playlist:{" "}
          <a href={exportedPlaylist} target="_blank" rel="noopener noreferrer">
            {exportedPlaylist}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
