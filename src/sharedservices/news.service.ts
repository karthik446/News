import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Config } from "../config/configprovider";
import { IArticle, ISource } from "../models/models";

import _ from 'lodash';
import { ArticleRepository } from "../repositories/repositories";

@Injectable()
export class NewsService {
    private articles: Array<IArticle> = new Array<IArticle>();
    private sources: Array<ISource>;
    constructor(private http: Http,
        private config: Config,
        private articalrepo: ArticleRepository) { this.getSources(); }
    /**
     * Get's all the articles for all the sources
     * If can be queried on latest, get's the latest if not top
     */
    getAllArticles(): void {
        if (this.articles.length) return;
        if (this.sources) {
            let observables = new Array<Observable<IArticle[]>>();
            this.sources.forEach(source => {
                // let sortType = source.sortBysAvailable.length > 1 ? this.config.latestSortBy : this.config.topSortBy;
                let url = `${this.config.baseArticleUrl}?source=${source.id}&apiKey=${this.config.apiKey}`;
                observables.push(this.http.get(url).map(response => {
                    let res = <any>response;
                    return _.map(JSON.parse(res._body).articles, (article: any) => this.articalrepo.MapArticle(article, source));
                }));
            });
            Observable.forkJoin(observables).subscribe(res => { res.forEach(r => { r.forEach(p => this.articles.push(p)); }); });
        }
        return void 0;
    }
    /**
     * Get all the sources on initial Load and save them!
     * Internally get's all the articles.
     */
    getSources(): Observable<ISource[]> {
        if (this.sources) return Observable.of(this.sources);
        return this.http.get(this.config.sourcesUrl).map(response => {
            var res = <any>response;
            this.sources = JSON.parse(res._body).sources;
            this.getAllArticles();
            return this.sources
        });
    }
    public showHomeScreenArticles(): Observable<IArticle[]> {
        let source = this.sources.find(p => p.id === "bbc-news");
        let url = `${this.config.baseArticleUrl}?source=bbc-news&sortBy=top&apiKey=${this.config.apiKey}`;
        return this.http.get(url).map(response => {
            let res = <any>response;
            return _.map(JSON.parse(res._body).articles, (article: any) => this.articalrepo.MapArticle(article, source));
        })
    }
    public searchArticles(q: string): Observable<IArticle[]> {
        if (!this.articles.length) this.getAllArticles();
        var filteredStores = _.chain(this.articles)
            .filter((p: IArticle) => _.includes(p.title.toLowerCase(), q.toLowerCase()))
            .orderBy((p: IArticle) => p.publishedAt, ['desc'])
            .value();
        return Observable.of(filteredStores);
    }
}