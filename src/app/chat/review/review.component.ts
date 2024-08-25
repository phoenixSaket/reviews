import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnChanges {
  
  @Input() data: any = {};
  public rating: any[] = [];

  constructor() { }

  ngOnChanges(): void {
    console.log(this.data)
    let rating = this.data.rating;

    for(let i = 1; i <= 5; i++) {
      if(i <= rating) {
        this.rating.push({shouldHighlight : true});
      } else {
        this.rating.push({shouldHighlight : false});
      }
    }
  }

}
