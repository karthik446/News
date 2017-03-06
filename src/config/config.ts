export class Config {
    public apiKey: string = 'fa5f97e91f714b51a18f8f723927c075'
    public sourcesUrl: string = "https://newsapi.org/v1/sources"
    public baseArticleUrl: string = "https://newsapi.org/v1/articles"
    public latestSortBy: string = "latest";
    public topSortBy: string = "top";
    // This is for the Nyt API
    // public apiKey: string = 'cf502212feec406e8d8b0c5982032eab'    
    // private topStoriesUrl: string = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${this.topStoryConfig.apiKey}`;
    // private articleSearchUrl: string = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${this.topStoryConfig.apiKey}`;

}