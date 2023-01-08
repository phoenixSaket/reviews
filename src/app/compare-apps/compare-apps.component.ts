import { Component, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-compare-apps',
  templateUrl: './compare-apps.component.html',
  styleUrls: ['./compare-apps.component.css']
})
export class CompareAppsComponent implements OnInit {

  compareAppsArray:any[] = [];
  public apps: any = {};
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];
  public isIOS: boolean = false;
  // categoriesArray = ['Rating', 'Reviews', 'Comment', '1*', '2*'];
  constructor(private data: DataService, private ios: IosService, private android: AndroidService) { }

  ngOnInit(): void {
    this.data.compareAppAdded.subscribe((app: any) => {
      if(!!app) {
        this.compareAppsArray = app;
        console.log(app);
      }
      // this.apps = app;
      // this.androidReviews = [];
      //   this.iosReviews = [];
      //   if (app.isIOS) {
      //     this.isIOS = true;
      //     console.log('ios')
      //   } else {
      //     this.isIOS = false;
      //     console.log('android')
      //     console.log('apps'+JSON.stringify(this.ios.getAppReviews(app, 1)));
      //     // this.android.
      //   }
    });
  }

}
