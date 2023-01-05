import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public app: any = {};
  public isLoading: boolean = false;
  public versions: number[] = [];
  public years: number[] = [];
  private backup: any[] = [];
  private length: number = 0;

  constructor(
    public data: DataService,
    private android: AndroidService,
    private ios: IosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.isLoading = true;
        this.versions = [];
        this.years = [];
        this.backup = [];
        this.snackBar.open("Reviews loading ...", "Close", {
          duration: 3000, horizontalPosition: "end",
          verticalPosition: "bottom",
        });
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
    this.android.getAppReviews(app.appId).subscribe((response: any) => {
      this.androidReviews = JSON.parse(response.result).data;
      this.androidReviews.forEach((review: any) => {
        if (!this.versions.includes(review.version)) {
          this.versions.push(review.version);
        }
        if (!this.years.includes(new Date(review.date).getFullYear())) {
          this.years.push(new Date(review.date).getFullYear());
        }
      })
      this.backup = JSON.parse(JSON.stringify(this.androidReviews));
      this.stopLoading();
    })
  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
      const max = this.getMaxPages(JSON.parse(response.result).feed.link);
      for (let i = 1; i <= max; i++) {
        this.storeIOSReviews(app.id, i);
      }
    });
  }

  storeIOSReviews(appId: string, page: number) {
    this.ios.getAppReviews(appId, page).subscribe((response: any) => {
      JSON.parse(response.result).feed.entry.forEach((entry: any) => {
        this.iosReviews.push(entry);
        if (!this.versions.includes(entry["im:version"].label)) {
          this.versions.push(entry["im:version"].label);
        }
        if (!this.years.includes(new Date(entry.updated.label).getFullYear())) {
          this.years.push(new Date(entry.updated.label).getFullYear());
        }
      });
      this.backup = JSON.parse(JSON.stringify(this.iosReviews));
      this.stopLoading();
    });
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any) => {
      if (link.attributes.rel == "last") {
        const lk = link.attributes.href;
        const page = lk.toString().substring(lk.toString().indexOf("page=") + 5, lk.toString().indexOf("/", lk.toString().indexOf("page=") + 5));
        maxPage = page;
      }
    })
    return maxPage;
  }

  stopLoading() {
    this.isLoading = false;
    this.snackBar.open("Reviews loaded", "Close", {
      duration: 3000, horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  versionFilter(version: any) {
    if (this.app.isIOS) {
      if (version == -1) {
        this.iosReviews = this.backup;
      } else {
        this.iosReviews = this.backup.filter(app => { return app["im:version"].label == version });
      }
      this.length = this.iosReviews.length;
    } else {
      if (version == -1) {
        this.androidReviews = this.backup;
      } else {
        this.androidReviews = this.backup.filter(app => { return app.version == version });
      }
      this.length = this.androidReviews.length;
    }
    this.sortSnackbar(this.length + " matching Reviews.");
  }

  yearFilter(year: any) {
    if (this.app.isIOS) {
      if (year == -1) {
        this.iosReviews = this.backup;
      } else {
        this.iosReviews = this.backup.filter(app => { return new Date(app.updated.label).getFullYear() == year });
      }
      this.length = this.iosReviews.length;
    } else {
      if (year == -1) {
        this.iosReviews = this.backup;
      } else {
        this.androidReviews = this.backup.filter(app => { return new Date(app.date).getFullYear() == year });
      }
      this.length = this.androidReviews.length;
    }
    this.sortSnackbar(this.length + " matching Reviews.");
  }

  searchSort(keyword: any) {
    if (this.app.isIOS) {
      this.iosReviews = this.backup.filter(app => { if (app.content.label.includes(keyword) || app.title.label.includes(keyword)) { return app } });
      this.length = this.iosReviews.length;
    } else {
      this.androidReviews = this.backup.filter(app => { if (app.text.includes(keyword) || app.title.includes(keyword)) { return app } });
      this.length = this.iosReviews.length;
    }
    this.sortSnackbar(this.length + " matching Reviews.");
  }

  sortSnackbar(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 3000, horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  ratingFilter(ratingArray: any) {
    console.log("rating", ratingArray);
    console.log("backup", this.backup);

    let array: any[] = ratingArray;
    let temp: any = [];
    let app = "";
    let length: number = 0;
    this.iosReviews = [];
    this.androidReviews = [];

    array.forEach((element: any) => {

      if (element.isSelected) {

        this.backup.forEach((el: any) => {
          let rating = "";
          if (!!el?.score) {
            rating = el.score;
            app = "android";
          } else if (!!el["im:rating"]?.label) {
            rating = el["im:rating"].label;
            app = "ios";
          }
          if (rating == element.text) {
            if (app == "ios") {
              this.iosReviews.push(el);
            } else {
              this.androidReviews.push(el);
            }
          }
        });
      }
    });
    length = this.iosReviews.length + this.androidReviews.length;
    this.sortSnackbar(length + " matching reviews");
  }
}
