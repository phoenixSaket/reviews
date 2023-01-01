import { Component, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.css']
})
export class ReviewsPageComponent implements OnInit {
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];
  public isIOS: boolean = false;
  public app: any ={};

  constructor(
    private data: DataService,
    private android: AndroidService,
    private ios: IosService
  ) { }

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.app = app;
        this.androidReviews = [];
        this.iosReviews = [];
        if (app.isIOS) {
          this.isIOS = true;
          this.getIOSReviews(app);
        } else {
          this.isIOS = false;
          this.getAndroidReviews(app);
        }
      }
    })
  }

  getAndroidReviews(app: any) {
    this.android.getAppReviews(app.appId).subscribe((response: any)=> {
      this.androidReviews = JSON.parse(response.result).data;
      console.log("Android Reviews", this.androidReviews);
    })
  }

  getIOSReviews(app: any, page:number = 1) {
    this.ios.getAppReviews(app.id, 1).subscribe((response: any)=> {
      const max= this.getMaxPages(JSON.parse(response.result).feed.link);
      for(let i = 1; i <= max; i++) {
        this.storeIOSReviews(app.id, i);
      }
    });
  }
  
  storeIOSReviews(appId: string, page: number) {
    this.ios.getAppReviews(appId, page).subscribe((response: any)=> {
      JSON.parse(response.result).feed.entry.forEach((entry: any)=> {
        this.iosReviews.push(entry);
      })
      console.log("IOS Review : ", this.iosReviews);
    });
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any)=> {
      if(link.attributes.rel == "last") {
        const lk = link.attributes.href;
        const page = lk.toString().substring(lk.toString().indexOf("page=")+5, lk.toString().indexOf("/", lk.toString().indexOf("page=")+5));
        maxPage = page;
      }
    })
    return maxPage;
  }

}
