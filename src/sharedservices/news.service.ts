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
/**
 * News Service - An NG Service that calls the api to get the data
 * Created: Karthik Saraswathibatla
 */
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
    allArticles(): Array<IArticle> { return this.articles; }
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
    private sortBydate = (a, b): number => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

    /**
     * User should be able to customize home screen, this Returns all the Home Screen Articles
     * For now it's hardcoded to bbc News
     */
    public showHomeScreenArticles(): Observable<IArticle[]> {
        let source = this.sources.find(p => p.id === "bbc-news");
        let url = `${this.config.baseArticleUrl}?source=bbc-news&sortBy=top&apiKey=${this.config.apiKey}`;
        return this.http.get(url).map(response => {
            let res = <any>response;
            let stories = _.map(JSON.parse(res._body).articles, (article: any) => this.articalrepo.MapArticle(article, source));
            stories = stories.sort(this.sortBydate);
            return stories;
        })
    }
    /**
     * Searches for the article/description which contains the string
     * @param q Search String
     * todo: should find an effective way to manage the search 
     */
    public searchArticles(q: string): Observable<IArticle[]> {
        if (!this.articles.length) this.getAllArticles();
        var filteredStores = _.chain(this.articles)
            .filter((p: IArticle) => _.includes(p.title.toLowerCase(), q.toLowerCase() || _.includes(p.description.toLowerCase(), q.toLowerCase()))).value();
        filteredStores = filteredStores.sort(this.sortBydate);
        return Observable.of(filteredStores);
    }
}