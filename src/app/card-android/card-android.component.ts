import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-android',
  templateUrl: './card-android.component.html',
  styleUrls: ['./card-android.component.css']
})
export class CardAndroidComponent implements OnInit {
  @Input() data: any = {};
  public rating: any[] = [];

  constructor() { }

  ngOnInit(): void {
    let rating = this.data.score;

    for(let i = 1; i <= 5; i++) {
      if(i <= rating) {
        this.rating.push({shouldHighlight : true});
      } else {
        this.rating.push({shouldHighlight : false});
      }
    }
  }

}
