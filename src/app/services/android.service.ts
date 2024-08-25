import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ANDROID } from './services';

@Injectable({
  providedIn: 'root'
})
export class AndroidService {
  public androidAppsDefault = [
    'com.ibx.ibxmobile',
    'com.ahnj.ahmobile',
    'com.ahc.ahcmobile'
  ];
  public histograms: any[] = [];

  constructor(private http: HttpClient) { }

  getApp(app: string, useBackup: boolean = false) {
    let url = ANDROID.app;
    return this.http.post(url, { name: app.toLowerCase() });
  }

  getAppReviews(app: string, useBackup: boolean = false) {
    let url = ANDROID.review;
    return this.http.post(url, { name: app.toLowerCase() });
  }

  searchApp(term: string, num: number, lang: string, price: string, useBackup: boolean = false) {
    let url = ANDROID.search;
    return this.http.post(url, { term: term.toLowerCase(), num: num, lang: lang, price: price })
  }

  setHistogram(app: any, histogram: any) {
    if (!this.histograms.includes({ app: app.name, histogram: histogram })) {
      this.histograms.push({ app: app.name, histogram: histogram });
    }
  }

  getHistogram(appName: string): any {
    return this.histograms.find(app => { return app.app == appName });
  }

  sentimentAnalysis(text: string[]) {
    let url = ANDROID.sentiment;
    return this.http.post(url, {string: text});
  }
}
