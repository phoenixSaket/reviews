import { Component, Input, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() apps: any[] = [];
  public isSideBarOpen: boolean = false;
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];

  constructor(public sidebar: SidebarService, public data: DataService, private android: AndroidService, private ios: IosService) {}

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.androidReviews = [];
        this.iosReviews = [];
        if (app.isIOS) {
          this.getIOSReviews(app);
        } else {
          this.getAndroidReviews(app);
        }
      }
    });
  }

  getAndroidReviews(app: any) {
    this.android.getAppReviews(app.appId, true).subscribe(
      (response: any) => {
        this.androidReviews = JSON.parse(response.result).data;
        this.androidReviews.forEach((review: any) => {});
      },
      (error: any) => {
        this.android.getAppReviews(app.appId).subscribe(
          (response: any) => {
            this.androidReviews = JSON.parse(response.result).data;
            this.androidReviews.forEach((review: any) => {});
          },
          (error: any) => {
            this.android.getAppReviews(app.appId).subscribe((response: any) => {
              this.androidReviews = JSON.parse(response.result).data;
              this.androidReviews.forEach((review: any) => {});
            });
          }
        );
      }
    );
  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app.id, 1, true).subscribe(
      (response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.storeIOSReviews(app.id, i, max);
        }
      },
      (error: any) => {
        console.log(error);
        this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
          const max = this.getMaxPages(JSON.parse(response.result).feed.link);
          for (let i = 1; i <= max; i++) {
            this.storeIOSReviews(app.id, i, max);
          }
        });
      }
    );
  }

  storeIOSReviews(appId: string, page: number, max: number) {
    this.ios.getAppReviews(appId, page, true).subscribe(
      (response: any) => {
        JSON.parse(response.result).feed.entry.forEach((entry: any) => {
          this.iosReviews.push(entry);
        });
      },
      (error: any) => {
        this.ios.getAppReviews(appId, page).subscribe((response: any) => {
          JSON.parse(response.result).feed.entry.forEach((entry: any) => {
            this.iosReviews.push(entry);
          });
        });
      }
    );
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any) => {
      if (link.attributes.rel == 'last') {
        const lk = link.attributes.href;
        const page = lk
          .toString()
          .substring(
            lk.toString().indexOf('page=') + 5,
            lk.toString().indexOf('/', lk.toString().indexOf('page=') + 5)
          );
        maxPage = page;
      }
    });
    return maxPage;
  }

  ngOnChanges() {
    let page = this.data.getCurrentPage();
  }

  toggleSideBar() {
    // this.isSideBarOpen = !this.isSideBarOpen;
    if (this.sidebar.getIsSidebarOpen()) {
      this.sidebar.closeSidebar();
    } else {
      this.sidebar.openSidebar();
    }
  }
}
