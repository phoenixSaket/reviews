import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AndroidService } from '../services/android.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public chart: any;
  private histogram: any = {};
  public apps: any[] = [];

  constructor(private android: AndroidService, private ios: IosService) { }

  ngAfterViewInit(): void {
    let iosApps: any[] = []; //this.ios.iosAppsDefault;
    let androidApps: any[] = []; //this.android.androidAppsDefault;

    let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

    apps.forEach((app: any) => {
      if (app.isIOS) {
        iosApps.push(app.app);
      } else {
        androidApps.push(app.app);
      }
    })

    iosApps.forEach((app, index: number) => {
      this.apps.push(app);
      this.ios.getAPPRatings(app).subscribe((response: any) => {
        this.histogram = JSON.parse(response.result).histogram;
        this.createChart(app);
      })
    });

    androidApps.forEach(app => {
      this.apps.push(this.getAppNameAndroid(app));
    })

    androidApps.forEach(appName => {
      this.android.getApp(appName).subscribe((response: any) => {
        let resp: any = JSON.parse(response.result);
        this.histogram = resp.histogram;
        this.createChart(this.getAppNameAndroid(appName));
      });
    })
  }

  createChart(app: string) {
    this.chart = new Chart('' + app, {
      type: 'pie',
      data: {
        // values on X-Axis
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: [
          {
            label: '' + app,

            data: Object.values(this.histogram),
            backgroundColor: [
              '#e67474',
              '#f5e050',
              '#dffadf',
              '#90ef90',
              '#04c900',
            ],
          },
        ],
      },
    });
  }

  getAppName(app: any): string {
    let name = "";
    switch (app) {
      case '584785907':
        name = "IBX - IOS";
        break;
      case '1112137390':
        name = "AHNJ On the Go - IOS";
        break;
      case '1337168006':
        name = "myAHABenefits - IOS";
        break;
      case '1337166340':
        name = "myIBXTPABenefits - IOS";
        break;
      case '1340456041':
        name = "AHC Mobile - IOS";
        break;
      default:
        name = app;
        break;
    }
    return name;
  }

  getAppNameAndroid(app: string): string {
    let name = "";
    switch (app) {
      case "com.ibx.ibxmobile":
        name = "IBX - Android";
        break;
      case "com.ahnj.ahmobile":
        name = "AHNJ On the Go - Android";
        break;
      case "com.ahatpa.ahamobile":
        name = "myAHABenefits - Android";
        break;
      case "com.ibxtpa.iamobile":
        name = "myIBXTPABenefits - Android";
        break;
      case "com.ahc.ahcmobile":
        name = "AHC Mobile - Android";
        break;
      default:
        break;
    }
    return name;
  }
}
