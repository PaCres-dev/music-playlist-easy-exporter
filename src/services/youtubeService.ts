import { Track, YoutubeVideoSearchResponse } from "../types/types";
import "dotenv/config";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

export const getVideoId = async (searchableTrack: Track) => {
  const url = new URL(`${YOUTUBE_API_URL}/search`);
  const params = new URLSearchParams({
    key: API_KEY,
    part: "id",
    q: `${searchableTrack.artists[0].name} - ${searchableTrack.name}`,
    type: "video",
    maxResults: "1",
    order: "relevance",
    fields: "items(id(videoId))",
  });

  url.search = params.toString();

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error fetching playlist: ${response.status} - ${response.statusText}`
      );
    }

    const data: YoutubeVideoSearchResponse = await response.json();

    if (!data.items) {
      throw new Error("No tracks found in playlist.");
    }

    return data.items[0].id.videoId;
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
};
