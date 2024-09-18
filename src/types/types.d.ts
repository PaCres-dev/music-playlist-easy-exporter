export interface Track {
  name: string;
  album: {
    name: string;
  };
  artists: {
    name: string;
  }[];
}

export interface SpotifyPlaylistTrackResponse {
  items: {
    track: Track;
  }[];
}

export interface YoutubeVideoSearchResponse {
  items: {
    id: {
      videoId: string;
    };
  }[];
}
