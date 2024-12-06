import {
  Track,
  YoutubeVideoSearchResponse,
  YoutubeErrorResponse,
} from "../types/types";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY.split(",") || "";
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

let activeApiKey = 0;

const rotateApiKey = () => {
  activeApiKey = (activeApiKey + 1) % API_KEY.length;
};

export const getVideoId = async (searchableTrack: Track): Promise<string> => {
  const url = new URL(`${YOUTUBE_API_URL}/search`);
  const params = new URLSearchParams({
    key: API_KEY[activeApiKey],
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
      const errorJson: YoutubeErrorResponse = await response.json();

      // Check if the error is due to quota exceeded
      if (
        response.status === 403 &&
        errorJson.error.errors[0].reason === "quotaExceeded"
      ) {
        console.warn("Quota exceeded for API key number:", activeApiKey);
        rotateApiKey();
        // Retry with the next API key
        return await getVideoId(searchableTrack);
      }

      throw new Error(
        `Error fetching video: ${response.status} - ${
          response.statusText
        } - ${JSON.stringify(await response.json())}`
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
