import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-android',
  templateUrl: './card-android.component.html',
  styleUrls: ['./card-android.component.css']
})
export class CardAndroidComponent implements OnInit {
  @Input() data: any = {};
  constructor() { }

  ngOnInit(): void {
  }

}
