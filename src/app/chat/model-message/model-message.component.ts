import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() app: {appName: string, isIOS: boolean};
  @ViewChild('messageRef', { static: false }) messageRef: ElementRef | undefined;
  
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

  copy(): void {
    if (this.messageRef) {
      const textToCopy = this.messageRef.nativeElement.textContent || '';
      if (navigator.clipboard) {
        // Use the modern Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
          console.log('Text successfully copied to clipboard!');
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      } else {
        // Fallback for older browsers
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        console.log('Text copied using fallback method!');
      }
    } else {
      console.error("Message reference is undefined. Cannot copy.");
    }
  }
}