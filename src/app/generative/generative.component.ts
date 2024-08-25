import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GenerativeService, platform } from '../services/generative.service';
import * as showdown from 'showdown';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-generative',
  templateUrl: './generative.component.html',
  styleUrls: ['./generative.component.css']
})
export class GenerativeComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() platform: platform;

  preDefinedPrompts: string[] = [
    "Summarize reviews",
    "Identify improvements",
    "Latest version reviews",
    "Identify issues"
  ];

  userPrompts: string[] = [];

  isButtonDisabled: boolean = true;
  prompt: string = "";
  content: string = "";
  isLoading: boolean = false;

  constructor(private generative: GenerativeService, private dataService: DataService) { }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.dataService.appLoader.subscribe((app) => {
      if(!!app) {
        this.content = "";
      }
    });

    this.userPrompts = this.dataService.retrievePreviousPrompt();
  }

  changePrompt(prompt: string) {
    this.isLoading = true;
    let type = this.getType(prompt);
        
    this.isButtonDisabled = true;
    this.content = "";
    this.generative.getSummaryV2(type, this.id, "", this.platform).subscribe((response: any) => {
      this.isLoading = false;
      this.prompt = "";
      if(response.opstatus == 0) {
        this.content = this.formatContent(response.message);
      }
    }, (error: any) => {
      console.log("GenerativeComponent.changePrompt -> getSummary error", error);
      this.isLoading = false;
      this.content = "There seems to be an error while calling Google's Gemini API.<br>Please try again in some time.";
    })
  }

  changeInput(event: any) {
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

    this.isButtonDisabled = true;
    this.content = "";
    if (this.prompt !== "summary" && this.prompt !== "latest" && this.prompt !== "improvements") {
      this.dataService.savePreviousPrompt(this.prompt);
      this.userPrompts = this.dataService.retrievePreviousPrompt();
    }
    this.generative.getSummaryV2("", this.id, this.prompt, this.platform).subscribe((response: any) => {
      this.isLoading = false;
      this.prompt = "";
      if(response.opstatus == 0) {
        this.content = this.formatContent(response.message);
      }
    }, (error: any) => {
      console.log("GenerativeComponent.changePrompt -> getSummary error", error);
      this.isLoading = false;
      this.content = "There seems to be an error while calling Google's Gemini API.<br>Please try again in some time.";
    })
  }

  getType(prompt: string): string {
    let r = "";
    switch (prompt) {
      case "Summarize reviews":
        r = "summary";
        break;
      case "Latest version reviews":
        r = "latest";
        break;
      case "Identify improvements":
        r = "improvements";
        break;
      case "Identify issues":
        r = "issues";
        break
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

  copy(element: HTMLElement) {
    this.dataService.copy(element);
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
