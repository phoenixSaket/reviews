import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GenerativeService } from '../services/generative.service';
import * as showdown from 'showdown';

@Component({
  selector: 'app-generative',
  templateUrl: './generative.component.html',
  styleUrls: ['./generative.component.css']
})
export class GenerativeComponent implements OnInit, OnChanges {

  @Input() androidReviews: any;
  @Input() iosReviews: any;

  preDefinedPrompts: string[] = [
    "Summarize the reviews",
    "Identify Issues",
    "Identify Improvements"
  ];

  isButtonDisabled: boolean = true;
  prompt: string = "";
  content: string = "";
  isLoading: boolean = false;

  constructor(private generative: GenerativeService) { }

  ngOnChanges(): void {
  }

  ngOnInit(): void { }

  formatDataAndroid(data: any[]): singleEntry[] {
    console.log("GenerativeComponent.formatDataAndroid", data);

    let temp: singleEntry[] = [];

    data.forEach((entry: any) => {
      let singleEntry: singleEntry = {
        author: entry.userName || '',
        updated: entry.date || '',
        rating: entry.scoreText || '',
        version: entry.version || '',
        content: entry.text || '',
        title: entry.title || ''
      }
      temp.push(singleEntry);
    });

    return temp;
  }

  formatDataIos(data: any[]): singleEntry[] {
    console.log("GenerativeComponent.formatDataIos", data);
    let temp: singleEntry[] = [];

    data.forEach((entry: any) => {
      let singleEntry: singleEntry = {
        author: entry.author.name.label,
        updated: entry.updated.label,
        rating: entry['im:rating'].label,
        version: entry['im:version'].label,
        content: entry.content.label,
        title: entry.title.label
      }
      temp.push(singleEntry);
    });

    return temp;
  }

  changePrompt(prompt: string) {
    console.log("GenerativeComponent.changePromt", prompt);
    this.isLoading = true;
    let type = this.getType(prompt);
    let appData = this.androidReviews.length > 0 ? this.androidReviews : this.iosReviews.length > 0 ? this.iosReviews : "";
    appData = this.androidReviews.length > 0 ? this.formatDataAndroid(appData) : this.formatDataIos(appData);

    let data = JSON.stringify({data: appData}).replace(/"/g, "'").replace(/\\n/g, "").replace(/\\r/g, "").replace(/\//g, "");
    
    this.isButtonDisabled = true;
    this.content = "";
    this.generative.getSummary(type, data, "").subscribe((response: any) => {
      this.isLoading = false;
      this.prompt = "";
      console.log("GenerativeComponent.changePrompt -> getSummary success", response);
      if(response.opstatus == 0) {
        this.content = this.formatContent(response.message);
      }
    }, (error: any) => {
      console.log("GenerativeComponent.changePrompt -> getSummary error", error);
    })
  }

  changeInput(event: any) {
    console.log("GenerativeComponent.changeInput", event.target.value);
    let value = event.target.value;
    if (value.length > 0) {
      this.prompt = value.trim();
      this.isButtonDisabled = false;
    } else {
      this.prompt = "";
      this.isButtonDisabled = true;
    }
  }

  generate() {
    this.isLoading = true;
    let appData = this.androidReviews.length > 0 ? this.androidReviews : this.iosReviews.length > 0 ? this.iosReviews : "";
    appData = this.androidReviews.length > 0 ? this.formatDataAndroid(appData) : this.formatDataIos(appData);

    let data = JSON.stringify({data: appData}).replace(/"/g, "'").replace(/\\n/g, "").replace(/\\r/g, "").replace(/\//g, "");

    this.isButtonDisabled = true;
    this.content = "";
    this.generative.getSummary("", data, this.prompt).subscribe((response: any) => {
      this.isLoading = false;
      this.prompt = "";
      console.log("GenerativeComponent.changePrompt -> getSummary success", response);
      if(response.opstatus == 0) {
        this.content = this.formatContent(response.message);
      }
    }, (error: any) => {
      console.log("GenerativeComponent.changePrompt -> getSummary error", error);
    })
  }

  getType(prompt: string): string {
    let r = "";
    switch (prompt) {
      case "Summarize the reviews":
        r = "summary";
        break;
      case "Identify Issues":
        r = "issues";
        break;
      case "Identify Improvements":
        r = "improvements";
        break;
      default:
        r = "";
        break;
    }
    return r;
  }

  formatContent(content: string): string {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(content);
    return html;
  }
}

export interface singleEntry {
  author: string;
  updated: string;
  rating: string;
  version: string;
  content: string;
  title: string;
}
