import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
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
  public type: string = "pie";
  public loading: boolean = true;
  public appLoading: number = 0;
  public loadingPercent: number = 0;

  constructor(public data: DataService, private android: AndroidService, private ios: IosService) { }

  ngAfterViewInit(): void {
    this.data.loadedApps.subscribe((data: number) => {
      this.appLoading = data;
      this.loadingPercent = (data * 100) / (this.data.totalApps == 0 ? 10 : this.data.totalApps);
      if (!!data && data > -1 && (data == (this.data.totalApps == 0 ? 10 : this.data.totalApps) - this.data.failedApps)) {

        setTimeout(() => {
          this.loading = false;
        }, 400);

        this.chart?.destroy()
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
          this.apps.push({ appName: app, type: 'pie' });

          this.ios.getAPPRatings(app).subscribe((response: any) => {
            this.histogram = JSON.parse(response.result).histogram;
            this.createChart(app, "pie");
            this.createChart(app, "bar");
          })
        });

        androidApps.forEach(app => {
          this.apps.push({ appName: app, type: 'pie' });
        })

        androidApps.forEach(appName => {
          this.android.getApp(appName).subscribe((response: any) => {
            let resp: any = JSON.parse(response.result);
            this.histogram = resp.histogram;
            this.createChart(appName, "pie");
            this.createChart(appName, "bar");
          });
        })
      }
    })
  }

  createChart(app: string, type: string) {
    let array: number[] = Object.values(this.histogram);
    let total: number = array.reduce((a: number, b: number) => { return a + b });

    let percent: string[] = [];

    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      percent.push((element * 100 / total).toFixed());
    }

    if (type == 'pie') {
      this.chart = new Chart('' + app + 'pie', {
        type: 'pie',
        data: {
          // values on X-Axis
          labels: ['1★ ( ' + percent[0] + '% )', '2★ ( ' + percent[1] + '% )', '3★ ( ' + percent[2] + '% )', '4★ ( ' + percent[3] + '% )', '5★ ( ' + percent[4] + '% )'],
          datasets: [
            {
              label: '' + this.getAppName(app),

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
        }
      });
    } else {
      this.chart = new Chart('' + app + 'bar', {
        type: 'bar',
        data: {
          // values on X-Axis
          labels: ['1★', '2★', '3★', '4★', '5★'],
          datasets: [
            {
              label: '' + this.getAppName(app),
              // labels: ['1★', '2★', '3★', '4★', '5★'],
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
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  getAppName(app: any): string {
    let name = app;
    this.data.getAppName().forEach(appInner => {
      if (appInner.id == app) {
        name = appInner.appName + (appInner.isIOS ? ' - IOS' : ' - Android');
      }
    })
    return name;
  }

  togglePage(index: number) {
    let canvas = document.querySelector('#canvas' + index);

    if ((canvas?.scrollLeft || 0) == 0) {
      canvas?.scrollBy(300, 0);
      this.apps[index].type = "bar";
    } else {
      canvas?.scrollBy(-300, 0);
      this.apps[index].type = "pie";
    }
  }

}
