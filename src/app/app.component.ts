import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndroidService } from './services/android.service';
import { DataService } from './services/data.service';
import { IosService } from './services/ios.service';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Reviews Dashboard';
  public apps: any[] = [];
  public width: number = screen.width;

  constructor(
    private ios: IosService,
    private android: AndroidService,
    private cdr: ChangeDetectorRef,
    private data: DataService,
    public sidebar: SidebarService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    let apps: any = localStorage.getItem("apps-review") || "[]";
    let iosApps = [];
    let androidApps = [];

    if ((typeof (JSON.parse(apps)) == "object") && (JSON.parse(apps).length > 0)) {
      let localApps: any[] = JSON.parse(apps);
      localApps.forEach((app: any) => {
        if (app.isIOS) {
          this.ios.getApp(app.app).subscribe((response: any) => {
            let resp: any = JSON.parse(response.result);
            this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: true, id: resp.id, appId: resp.appId });
            this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
            this.cdr.detectChanges();
            // this.saveToLocalStorage({ app: app, isIOS: true });
          })
        } else {
          this.android.getApp(app.app).subscribe((response: any) => {
            let resp: any = JSON.parse(response.result);
            this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId });
            this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
            this.cdr.detectChanges();
            // this.saveToLocalStorage({ app: app, isIOS: false });

            let appAndroid = { name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId }
            let histogram = { reviews: resp.reviews, ratings: resp.ratings, histogram: resp.histogram }
            this.android.setHistogram(appAndroid, histogram);
          })
        }
      })
    } else {
      iosApps = this.ios.iosAppsDefault;
      iosApps.forEach(app => {
        this.ios.getApp(app).subscribe((response: any) => {
          let resp: any = JSON.parse(response.result);
          this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: true, id: resp.id, appId: resp.appId });
          this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
          this.cdr.detectChanges();
          this.saveToLocalStorage({ app: app, isIOS: true });
        })
      });

      androidApps = this.android.androidAppsDefault;
      androidApps.forEach(app => {
        this.android.getApp(app).subscribe((response: any) => {
          let resp: any = JSON.parse(response.result);
          this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId });
          this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
          this.cdr.detectChanges();
          this.saveToLocalStorage({ app: app, isIOS: false });

          let appAndroid = { name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId }
          let histogram = { reviews: resp.reviews, ratings: resp.ratings, histogram: resp.histogram }
          this.android.setHistogram(appAndroid, histogram);
        })
      })
    }

    this.data.newAppAdded.subscribe((data: any) => {
      if (!!data) {

        if (data.isIOS) {
          this.ios.getApp(data.app).subscribe((response: any) => {
            let resp: any = JSON.parse(response.result);
            this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: true, id: resp.id, appId: resp.appId });
            this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
            this.cdr.detectChanges();
            this.saveToLocalStorage({ app: data.app, isIOS: true });
            this.snackbar.open(data.app.toString() + " added !", "Close", {
              duration: 300, horizontalPosition: "end",
              verticalPosition: "bottom"
            });
          })
        } else {
          this.android.getApp(data.app).subscribe((response: any) => {
            let resp: any = JSON.parse(response.result);
            this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId });
            this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else { return 0 } });
            this.cdr.detectChanges();
            this.saveToLocalStorage({ app: data.app, isIOS: false });
            this.snackbar.open(data.app.toString() + " added !", "Close", {
              duration: 300, horizontalPosition: "end",
              verticalPosition: "bottom"
            });

            let appAndroid = { name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId }
            let histogram = { reviews: resp.reviews, ratings: resp.ratings, histogram: resp.histogram }
            this.android.setHistogram(appAndroid, histogram);
          })
        }
      }
    })
  }

  saveToLocalStorage(app: any) {
    let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

    let check: boolean = false;
    apps.forEach((el: any) => {
      if (el.app == app.app) { check = true };
    });

    if (!check) {
      apps.push(app);
    }

    localStorage.setItem("apps-review", JSON.stringify(apps));
  }
}
