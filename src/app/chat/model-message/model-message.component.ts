import { Component, Input, OnInit } from '@angular/core';
import * as showdown from 'showdown';
import { DataService } from 'src/app/services/data.service';

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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.message = this.formatContent(this.message);
  }
  
  formatContent(content: string): string {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content);
    return html;
  }

  copy(element: HTMLElement) {
    this.dataService.copy(element);
  }
}