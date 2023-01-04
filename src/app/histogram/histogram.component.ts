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
  public histogram: any = {};

  constructor(private data: DataService, private android: AndroidService, private ios: IosService) { }

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        if (app.isIOS) {
          this.ios.getAPPRatings(app.id).subscribe((response: any) => {
            this.histogram = JSON.parse(response.result).histogram;
          })
        } else {
          this.histogram = this.android.getHistogram(app.name).histogram.histogram;
        }

      }
    })
  }

}
