import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TopStoryService } from "../../sharedservices/serviceproviders";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private stories: any[] = [];
  searchText: any = '';
  isSubscribed: boolean = false;
  constructor(public navCtrl: NavController, private topstorysvc: TopStoryService) { }
  sortBydate = (a, b): number => new Date(b.publisheddate).getTime() - new Date(a.publisheddate).getTime();

  /**
   * Get All Stories For the Search Term
   * searchTerm is ng bound to searchText
   * Calls the TopStoryService
   */
  getStories() {
    if (!this.searchText) return;
    this.isSubscribed = false;
    this.stories = [];

    this.topstorysvc.getStories(this.searchText)
      .subscribe(data => {
        this.isSubscribed = true;
        if (this.stories.length && this.isSubscribed) {
          data.forEach(item => this.stories.push(item));
          this.stories = this.stories.sort(this.sortBydate);
        }
        else this.stories = data;
      });
  }
}