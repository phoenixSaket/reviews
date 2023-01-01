import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AndroidService } from './services/android.service';
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

  constructor(
    private ios: IosService,
    private android: AndroidService,
    private cdr: ChangeDetectorRef,
    public sidebar: SidebarService
  ) { }

  ngOnInit() {
    let apps: any = localStorage.getItem("apps") || "{}";
    let iosApps = [];
    let androidApps = [];
    if ((typeof (JSON.parse(apps)) == "object") && (JSON.parse(apps).length > 0)) {

    } else {
      iosApps = this.ios.iosAppsDefault;
      iosApps.forEach(app => {
        this.ios.getApp(app).subscribe((response: any) => {
          let resp: any = JSON.parse(response.result);
          this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: true, id: resp.id, appId: resp.appId });
          this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else {return 0} });
          this.cdr.detectChanges();
        })
      });

      androidApps = this.android.androidAppsDefault;
      androidApps.forEach(app => {
        this.android.getApp(app).subscribe((response: any) => {
          let resp: any = JSON.parse(response.result);
          this.apps.push({ name: resp.title, icon: resp.icon, rating: resp.score, isIOS: false, appId: resp.appId });
          this.apps.sort((a, b) => { if (a.name > b.name) { return 1 } else if (b.name > a.name) { return -1 } else {return 0} });
          this.cdr.detectChanges();
        })
      })
    }
  }
}
