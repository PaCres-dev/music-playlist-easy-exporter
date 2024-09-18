import { SpotifyPlaylistTrackResponse, Track } from "../types/types";
import "dotenv/config";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const getAccessToken = async () => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching playlist: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

export const getPlaylistTracks = async (
  accessToken: string,
  playlistId: string
): Promise<Track[]> => {
  const url = new URL(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`);
  const params = new URLSearchParams({
    fields: "items(track(name,album(name),artists(name)))",
  });

  url.search = params.toString();

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching playlist: ${response.status} - ${response.statusText}`
      );
    }

    const data: SpotifyPlaylistTrackResponse = await response.json();

    if (!data.items) {
      throw new Error("No tracks found in playlist.");
    }

    // Return only the track data
    return data.items.map((item) => item.track);
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
};
