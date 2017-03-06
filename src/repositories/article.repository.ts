import { IArticle, ISource } from "../models/models";

export class ArticleRepository {
    MapArticle(article: any, source: ISource): IArticle {
        return {
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            sourceThumbnail: source.urlsToLogos.small,
            sourceId: source.id
        }
    }
}