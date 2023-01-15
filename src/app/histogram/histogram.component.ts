import { Component, Input, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit {
  @Input() reviewsNo: number = 0;
  public histogram: any = {};
  public ratingsNo: number = 0;

  constructor(private data: DataService, private android: AndroidService, private ios: IosService) { }

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        if (app.isIOS) {
          this.ios.getAPPRatings(app.id, true).subscribe((response: any) => {
            this.histogram = JSON.parse(response.result).histogram;
            let ratings: number[] = Object.values(this.histogram);
            this.ratingsNo = ratings.reduce((a: number, b: number) => { return a + b })
          }, error=> {
            this.ios.getAPPRatings(app.id).subscribe((response: any) => {
              this.histogram = JSON.parse(response.result).histogram;
              let ratings: number[] = Object.values(this.histogram);
              this.ratingsNo = ratings.reduce((a: number, b: number) => { return a + b })
            });
          })
          
        } else {
          this.histogram = this.android.getHistogram(app.name).histogram.histogram;
          let ratings: number[] = Object.values(this.histogram);
          this.ratingsNo = ratings.reduce((a: number, b: number) => { return a + b })
        }
      }
    })

  }

}
