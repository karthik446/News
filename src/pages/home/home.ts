import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewsService } from "../../sharedservices/serviceproviders";
import { IArticle } from "../../models/models";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private articles: Array<IArticle> = new Array<IArticle>();
  public searchText: any = '';
  constructor(public navCtrl: NavController, private svc: NewsService) {
    this.svc.getSources().subscribe(data => {
      this.svc.showHomeScreenArticles().subscribe(data => { this.articles = data });
    });
  }
  /**
   * Search the article
   */
  searchArticles() {
    if (!this.searchText) return;
    this.svc.searchArticles(this.searchText).subscribe(data => { this.articles = data; });
  }
}