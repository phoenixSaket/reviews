import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { NewReviewsComponent } from '../new-reviews/new-reviews.component';
import { AndroidService } from './android.service';
import { IosService } from './ios.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public currentApp: any = {};
  private currentPage: string = "";
  private appNames: any[] = [];
  public failedApps: number = 0;
  public totalApps: number = JSON.parse(localStorage.getItem("apps-review") || "[]").length;
  public loadedApps: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public appLoader: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public newAppAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public compareAppAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public newReviewCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private newIOSReviews: any[] = [];
  private newAndroidReviews: any[] = [];
  public isSnackbarOpen: boolean = false;

  constructor(private http: HttpClient, private android: AndroidService, private ios: IosService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    let x = 0;
    this.newReviewCount.subscribe(values => {
      if (values == 1) {
        x += 1;
        if (x == this.getTotalApps()) {
          let date = new Date("03-01-2023").toString();
          localStorage.setItem("lastDate-reviews", date);
          let shouldShow: boolean = false;
          this.newAndroidReviews.forEach(el=> {
            if(el.reviews.length > 0) {
              shouldShow = true;
            }
          });
          this.newIOSReviews.forEach(el=> {
            if(el.reviews.length > 0) {
              shouldShow = true;
            }
          })

          if(shouldShow) {
            this.openNewReviewDialog();
          }
        }
      }
    })
  }

  setCurrentApp(app: any) {
    this.currentApp = app;
    this.appLoader.next(app);
  }

  getCurrentApp(): any {
    return this.currentApp;
  }

  getCurrentPage(): string {
    return this.currentPage;
  }

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  getAppName(): any[] {
    return this.appNames;
  }

  setAppName(appName: any) {
    this.appNames.push(appName);
  }

  getTotalApps() {
    this.totalApps = JSON.parse(localStorage.getItem("apps-review") || "[]").length;
    return this.totalApps;
  }

  sendMailApi(email: string, apps: any[]) {
    let payload = { email: email, apps: JSON.stringify(apps) }
    return this.http.post("https://reviews-be.cyclic.app/save-apps", payload);
    // return this.http.post("http://localhost:8000/save-apps", payload);
  }

  newReviewsCheck() {
    setTimeout(() => {
      this.loadedApps.subscribe(appsLoaded => {
        if (appsLoaded == this.getTotalApps()) {
          let lastDate = localStorage.getItem("lastDate-reviews") || null;
          if (!!lastDate) {
            let date = new Date(lastDate);
            let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");
            let iosReviews: any[] = [];
            let androidReviews: any[] = [];

            apps.forEach((app: any) => {
              let id = app.app;
              if (app.isIOS) {
                this.ios.getAppReviews(id, 1).subscribe((response: any) => {
                  let reviews = this.iosAlerts(JSON.parse(response.result).feed.entry);
                  let names = this.getAppName();
                  let name = names.find((el: any) => { return (el.id == id) ? el.appName : "" })
                  let temp: any[] = [];
                  reviews.forEach((rev: any) => {
                    temp.push(rev);
                  });
                  iosReviews.push({ name: name, reviews: temp });

                  this.newIOSReviews = iosReviews;
                  this.newReviewCount.next(1);
                })
              } else {
                this.android.getAppReviews(id).subscribe((response: any) => {
                  let reviews = this.androidAlerts(JSON.parse(response.result).data);
                  let names = this.getAppName();
                  let name = names.find((el: any) => { return (el.id == id) ? el.appName : "" })
                  let temp: any[] = [];

                  reviews.forEach((rev: any) => {
                    temp.push(rev);
                  });

                  androidReviews.push({ name: name, reviews: temp });

                  this.newAndroidReviews = androidReviews;
                  this.newReviewCount.next(1);
                })
              }
            })
          } else {
            let date = new Date("03-01-2023").toString();
            localStorage.setItem("lastDate-reviews", date);
          }
        }
      })

    }, 100);
  }

  iosAlerts(reviews: any): any[] {
    let lastDate = new Date(localStorage.getItem("lastDate-reviews") || "");
    let iosReviews: any[] = [];

    reviews.forEach((rev: any) => {
      if (new Date(rev.updated.label) >= lastDate) {
        iosReviews.push(rev);
      }
    })
    return iosReviews;
  }

  androidAlerts(reviews: any) {
    let lastDate = new Date(localStorage.getItem("lastDate-reviews") || "");
    let androidReviews: any[] = [];

    reviews.forEach((rev: any) => {
      if (new Date(rev.date) >= lastDate) {
        androidReviews.push(rev);
      }
    });

    return androidReviews;
  }

  openNewReviewDialog() {
    this.isSnackbarOpen = true;
    this.snackBar
      .open('New Reviews found !', 'Show', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      })
      .onAction()
      .subscribe((res) => {
        this.isSnackbarOpen = false;
        this.dialog.open(NewReviewsComponent, {
          data: { ios: this.newIOSReviews, android: this.newAndroidReviews },
        });
      });
  }

  sendEmail(message: string, email: string) {
    let payload = { email: email, message: message }
    // return this.http.post("https://reviews-be.cyclic.app/save-apps", payload);
    return this.http.post("https://reviews-be.cyclic.app/mail/send", payload);
  }
}
