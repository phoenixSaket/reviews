import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerativeService {

  constructor(private http: HttpClient) { }

  url: string = "https://review-un6v.onrender.com/get/summary";

  getSummary(type: string, appData: string, prompt: string) {
    return this.http.post(this.url, { type: type, appData: appData, prompt: prompt });
  }

  getSummaryV2(type: string, id: string, prompt: string, platform: platform) {
    let request: SummmaryV2Request = {
      id: id,
      platform: platform,
      type: type,
      prompt: prompt
    };
    return this.http.post(this.url+"/v2", request);
  }
}

export enum platform {
  android,
  ios
}

export interface SummmaryV2Request {
  id: string,
  platform: platform,
  type: string,
  prompt: string
}
