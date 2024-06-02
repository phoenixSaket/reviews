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
}
