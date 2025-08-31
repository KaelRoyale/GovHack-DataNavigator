import Config from "@/constants/Config";

export class GoogleSearchService {
    private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1'
    private readonly apiKey = Config.GOOGLE_API_KEY
    private readonly searchEngineId = Config.GOOGLE_SEARCH_ENGINE_ID

    constructor(){
        if(!this.apiKey||!this.searchEngineId){
            throw new Error("Google Search API credentials missing!")
        }
    }
}

export const googleSearchService = new GoogleSearchService();