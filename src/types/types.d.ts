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

export interface YoutubeErrorResponse {
  error: {
    code: number;
    message: string;
    errors: {
      message: string;
      domain: string;
      reason: string;
    }[];
  };
}
