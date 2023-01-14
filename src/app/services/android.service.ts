import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AndroidService {
  // public url = "https://review-un6v.onrender.com/android/";
  public url = "https://reviews-be.cyclic.app/android/";
  
  public androidAppsDefault = [
    'com.ibx.ibxmobile',
    'com.ahnj.ahmobile',
    'com.ahatpa.ahamobile',
    'com.ibxtpa.iamobile',
    'com.ahc.ahcmobile'
  ];
  public histograms: any[] = [];

  constructor(private http: HttpClient) { }

  getApp(app: string) {
    let url = this.url + "app";
    return this.http.post(url, { name: app });
  }

  getAppReviews(app:string) {
    let url = this.url + "review";
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string) {
    let url = this.url + "search";
    return this.http.post(url, { term: term, num: num, lang: lang, price: price })
  }

  setHistogram(app: any, histogram: any) {
    if(!this.histograms.includes({app: app.name, histogram: histogram})) {
      this.histograms.push({app: app.name, histogram: histogram});
    }
  }

  getHistogram(appName: string): any {
    return this.histograms.find(app=> {return app.app == appName});
  }
}
