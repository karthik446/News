import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from "../../sharedservices/serviceproviders";
import { IArticle } from "../../models/models";
import _ from 'lodash';
import 'rxjs/add/observable/of';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public searchText: any = '';

  private articles: Array<IArticle> = new Array<IArticle>();
  private allArticles: Array<IArticle> = new Array<IArticle>();
  private filteredArticles: Array<IArticle> = new Array<IArticle>();
  private currentSkipCount: number = 0;
  private itemsPerScroll: number = 30;
  private loadMore: boolean = false;

  constructor(public navCtrl: NavController, private svc: NewsService) {
    this.svc.getSources().subscribe(data => { this.svc.showHomeScreenArticles().subscribe(data => { this.articles = data }); });
  }
  /**
   * Search the article
   */
  searchArticles() {
    if (!this.searchText) return;
    this.svc.searchArticles(this.searchText).subscribe(data => {
      this.filteredArticles = data;
      if (this.filteredArticles.length > this.itemsPerScroll) this.loadMore = true;
      this.articles = _.take(this.filteredArticles, this.itemsPerScroll);
      this.currentSkipCount = this.articles.length;
    });
  }

  private filterArticles = (articles: Array<IArticle>) => _.chain(articles).drop(this.currentSkipCount).take(this.itemsPerScroll);

  scrollInfinite(infiniteScroll) {
    this.currentSkipCount += this.itemsPerScroll;
    this.allArticles = this.svc.allArticles();

    setTimeout(() => {

      this.articles = this.filteredArticles.length > this.itemsPerScroll
        ? this.filterArticles(this.filteredArticles)
        : this.filterArticles(this.allArticles);

      infiniteScroll.complete();
      this.loadMore = false;
    }, 500);
  }
}