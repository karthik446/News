import { IArticle, ISource } from "../models/models";

export class ArticleRepository {
    /**
     * Calculates if it has been days/minutes/hours since the article has been published
     * @param publishedAt Published date
     */
    private getElapsedTime(publishedAt: any): string {
        let today = new Date().getTime();
        let ms = Math.abs(today - new Date(publishedAt).getTime());
        let hours = Math.floor((ms % 86400000) / 3600000);;
        let days = Math.floor(ms / 86400000);;
        let minutes = Math.round(((ms % 86400000) % 3600000) / 60000);
        return minutes > 0 && minutes < 60 && hours === 0
            ? `${minutes}m`
            : hours > 0 && hours < 24
                ? `${hours}h`
                : `${days}d`;
    }

    /**
     * Maps the article from the API to IArticle type
     * @param article 
     * @param source 
     */
    MapArticle(article: any, source: ISource): IArticle {
        return {
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            sourceThumbnail: source.urlsToLogos.small,
            sourceId: source.id,
            timeElapsed: this.getElapsedTime(article.publishedAt)
        }
    }
}