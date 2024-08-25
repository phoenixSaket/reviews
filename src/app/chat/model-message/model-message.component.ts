import { Component, Input, OnInit } from '@angular/core';
import * as showdown from 'showdown';

@Component({
  selector: 'app-model-message',
  templateUrl: './model-message.component.html',
  styleUrls: ['./model-message.component.css']
})
export class ModelMessageComponent implements OnInit {

  @Input() message: string;
  @Input() hideOriginalMessage: boolean = false;
  review: any[] = [];
  hasReview: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.message = this.formatContent(this.message);

  }
  
  formatContent(content: string): string {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(content);
    // setTimeout(() => {
    //   if (!this.hideOriginalMessage) {
    //     this.covertIfHasReview(html)
    //   }
    // }, 200);
    return html;
  }

  // {"rating":"1","version":"9.0.6","content":"Trying to setup an account on an iPad and I can’t get the keyboard to display numbers. What a piece of crap this app is.","title":"Can’t even register"}
  covertIfHasReview(text: string) {
    let regex: RegExp = new RegExp("((\[[^\}]{3,})?\{s*[^\}\{]{3,}?:.*\}([^\{]+\])?)");
    let test;
    if (regex.test(text)) {
      test = Array.from(document.getElementsByClassName("json"));
      
      test.forEach(el => {
        this.hasReview = true;
        console.log(JSON.parse(el.innerHTML));
        if (Array.isArray(JSON.parse(el.innerHTML))) {
          JSON.parse(el.innerHTML).forEach(ele => {
            this.review.push(JSON.parse(ele));
          })
        } else {
          this.review.push(JSON.parse(el));
        }
      })
    }
  }

}
