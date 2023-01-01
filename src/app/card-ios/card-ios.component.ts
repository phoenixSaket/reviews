import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-ios',
  templateUrl: './card-ios.component.html',
  styleUrls: ['./card-ios.component.css']
})
export class CardIosComponent implements OnInit {
  @Input() data: any = {};
  public rating: any[] = [];
  constructor() { }

  ngOnInit(): void {
    let rating = this.data["im:rating"].label;

    for(let i = 1; i <= 5; i++) {
      if(i <= rating) {
        this.rating.push({shouldHighlight : true});
      } else {
        this.rating.push({shouldHighlight : false});
      }
    }
  }

}
