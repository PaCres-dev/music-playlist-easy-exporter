import { useState } from "react";
import { getAccessToken, getPlaylistTracks } from "./services/spotifyService";

import "./App.css";
import { getVideoId } from "./services/youtubeService";

function App() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [exportedPlaylist, setExportedPlaylist] = useState<string[]>([]);

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

    // Dividir la lista en fragmentos de 50 videos
    const chunkedTracks = [];
    for (let i = 0; i < youtubeTracks.length; i += 50) {
      chunkedTracks.push(youtubeTracks.slice(i, i + 50));
    }

    console.log(chunkedTracks);

    const youtubePlaylists = chunkedTracks.map((chunk) => {
      return `https://www.youtube.com/watch_videos?video_ids=${chunk.join(
        ","
      )}`;
    });

    setExportedPlaylist(youtubePlaylists);
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
      {exportedPlaylist.length > 0 && (
        <div>
          <p>YouTube playlists:</p>
          {exportedPlaylist.map((playlist, index) => (
            <p key={index}>
              <a href={playlist} target="_blank" rel="noopener noreferrer">
                Playlist {index + 1}
              </a>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
