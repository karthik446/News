import { IArticle } from "./Iarticle";

export class Article implements IArticle {
    author: string;
    title: string;
    description:string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    sourceThumbnail: string;
    sourceId:string;
    constructor() {}
}