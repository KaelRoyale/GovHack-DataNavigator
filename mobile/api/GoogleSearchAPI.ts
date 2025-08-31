import Config from "./Config";
import { GoogleCustomSearchResponseDto } from "@/dto/google/GoogleCustomSearchResponseDto";

const baseUrl = 'https://www.googleapis.com/customsearch/v1'
const apiKey = Config.GOOGLE_API_KEY;
const searchEngineId = Config.GOOGLE_SEARCH_ENGINE_ID

export async function search(
  keyword: string,
  startIndex: number = 1
): Promise<GoogleCustomSearchResponseDto> {
  try {
    const response = await fetch(
      `${baseUrl}?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
        keyword
      )}&start=${startIndex}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API error", error);
    throw error;
  }
}
