import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOS, IOS_INSERT_RATING } from './services';

@Injectable({
  providedIn: 'root'
})
export class IosService {

  public iosAppsDefault = ['584785907', '1112137390', '1340456041'];

  constructor(private http: HttpClient) { }

  getApp(app: string, useBackup: boolean = false) {
    const url = IOS.app;
    return this.http.post(url, { name: parseInt(app) });
  }

  getAppReviews(app: string, page: number, useBackup: boolean = false): Observable<any> {
    const url = IOS.review;
    return this.http.post(url, { name: app, page: page });
  }

  getAPPRatings(app: string, useBackup: boolean = false) {
    const url = IOS.rating;
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string, useBackup: boolean = false) {
    const url = IOS.search;
    return this.http.post(url, { term: term, num: num, lang: lang, price: price })
  }

  sentimentAnalysis(text: string[]) {
    const url = IOS.sentiment;
    return this.http.post(url, {string: text});
  }

  insertRatings(data: IOS_INSERT_RATING) {
    const url = IOS.insertRatings;
    return this.http.post(url, data);
  }
}
