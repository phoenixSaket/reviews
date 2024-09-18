import { Component, Input, OnInit } from '@angular/core';
import * as showdown from 'showdown';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent implements OnInit {

  @Input() message: string;
  @Input() hideOriginalMessage: boolean = false;
  @Input() app: {appName: string, isIOS: boolean};

  constructor() { }

  ngOnInit(): void {
  }

}
