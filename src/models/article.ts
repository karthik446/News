import { IArticle } from "./Iarticle";

export class Article implements IArticle {
    showThumbnail: boolean;
    headline: string;
    publisheddate: string;
    url: string;
    imgUrl: string;
    constructor() {}
}