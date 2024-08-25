import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AI } from './services';

@Injectable({
  providedIn: 'root'
})
export class GenerativeService {

  constructor(private http: HttpClient) { }

  getSummaryV2(type: string, id: string, prompt: string, platform: platform) {
    let request: SummmaryV2Request = {
      id: id,
      platform: platform,
      type: type,
      prompt: prompt
    };
    return this.http.post(AI.summaryV2, request);
  }

  initiateChat(request: InitiateChatRequest) {
    return this.http.post(AI.initiateChat, request);
  }

  chat(request: ChatRequest) {
    return this.http.post(AI.chat, request);
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

export interface InitiateChatRequest {
  id: string,
  platform: string
}

export interface ChatRequest {
  message: string,
  history: string
}

export interface ChatResponse {
  message: string,
  opstatus: number,
  history: any
}