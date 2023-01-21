import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IosService {
  public url = "https://review-un6v.onrender.com/ios/";
  public backupUrl = "https://reviews-be.cyclic.app/ios/";


  public iosAppsDefault = ['584785907', '1112137390', '1337168006', '1337166340', '1340456041'];

  constructor(private http: HttpClient) { }

  getApp(app: string, useBackup: boolean = false) {
    const url = (useBackup ? this.backupUrl : this.url) + "app";
    return this.http.post(url, { name: parseInt(app) });
  }

  getAppReviews(app: string, page: number, useBackup: boolean = false) {
    let url = (useBackup ? this.backupUrl : this.url) + "review";
    return this.http.post(url, { name: app, page: page });
  }

  getAPPRatings(app: string, useBackup: boolean = false) {
    let url = (useBackup ? this.backupUrl : this.url) + "rating";
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string, useBackup: boolean = false) {
    let url = (useBackup ? this.backupUrl : this.url) + "search";
    return this.http.post(url, { term: term, num: num, lang: lang, price: price })
  }

  sentimentAnalysis(text: string[]) {
    let url = this.backupUrl + "sentiment";
    return this.http.post(url, {string: text});
  }
}
