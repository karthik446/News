import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { TopStoryConfig } from "../config/configprovider";
import { IArticle } from "../models/Iarticle";
import _ from 'lodash';

@Injectable()
export class TopStoryService {

    constructor(private http: Http, private topStoryConfig: TopStoryConfig) { }
    private topStoriesUrl: string = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${this.topStoryConfig.apiKey}`;
    private articleSearchUrl: string = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${this.topStoryConfig.apiKey}`;
    
    getStories = (q: string): Observable<IArticle[]> => Observable.merge(this.searchAllStories(q), this.searchLatestStories(q))

    private getMediaUrl = (item: any): string => item.multimedia && item.multimedia.length > 0 ? item.multimedia[0].url : '';

    private maptoArticle(title: string, date: string, url: string, imgUrl: string): IArticle {
        return {
            headline: title,
            publisheddate: date,
            url: url,
            imgUrl: imgUrl || '',
            showThumbnail: imgUrl !== '' && imgUrl !== 'https://static01.nyt.com/'
        }
    }
    private searchLatestStories(q: string): Observable<IArticle[]> {
        return this.http.get(this.topStoriesUrl)
            .map(response => {
                return _.chain(response.json().results)
                    .filter(item => _.includes(item.title.toLocaleLowerCase(), q.toLocaleLowerCase()))
                    .orderBy(item => item.published_date, ['desc'])
                    .map(item => this.maptoArticle(item.title, item.published_date, item.url, this.getMediaUrl(item)))
                    .value()
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server Error'))
    }
    /**
     * Searches all Stories in NYT
     * @param q search string
     */
    private searchAllStories(q: string): Observable<IArticle[]> {
        return this.http.get(`${this.articleSearchUrl}&q=${q}`)
            .map(response => {
                var res = <any>response;
                var bodyresponse = JSON.parse(res._body).response;
                return _.chain(bodyresponse.docs)
                    .orderBy(item => item.pub_date, ['desc'])
                    .map(item => this.maptoArticle(item.headline.main, item.pub_date, item.web_url, `https://static01.nyt.com/${this.getMediaUrl(item)}`))
                    .value()
            })
            .catch((error: any) => {
                debugger;
                return Observable.throw('Server Error')

            })
    }
}