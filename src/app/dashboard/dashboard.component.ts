import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";
import { ApexDataLabels, ApexPlotOptions, ApexTheme, ApexYAxis } from 'ng-apexcharts/lib/model/apex-types';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[]
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions;
  theme: ApexTheme;
  colors: string[]
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  public chart: any;
  private histogram: any = {};
  public apps: any[] = [];
  public type: string = "pie";
  public loading: boolean = true;
  public appLoading: number = 0;
  public loadingPercent: number = 0;

  public charts: any[] = [];
  public charts2: any[] = [];

  total: any;

  constructor(public dataService: DataService, private android: AndroidService, private ios: IosService) { }

  ngAfterViewInit(): void {
    this.dataService.loadedApps.subscribe((data: number) => {
      this.appLoading = data;
      this.loadingPercent = (data * 100) / (this.dataService.getTotalApps() == 0 ? 10 : this.dataService.getTotalApps());
      if (!!data && data > -1 && (data == (this.dataService.getTotalApps() == 0 ? 10 : this.dataService.getTotalApps()) - this.dataService.failedApps)) {

        setTimeout(() => {
          this.loading = false;
        }, 400);

        this.chart?.destroy()
        let iosApps: any[] = []; //this.ios.iosAppsDefault;
        let androidApps: any[] = []; //this.android.androidAppsDefault;

        let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

        apps.forEach((app) => {
          setTimeout(() => {
            this.loadCharts(app);
          }, 100);
        })

        // apps.forEach((app: any) => {
        //   if (app.isIOS) {
        //     iosApps.push(app.app);
        //   } else {
        //     androidApps.push(app.app);
        //   }
        // })

        // iosApps.forEach((app, index: number) => {
        //   this.apps.push({ appName: app, type: 'pie' });

        //   this.ios.getAPPRatings(app, true).subscribe((response: any) => {
        //     this.histogram = JSON.parse(response.result).histogram;
        //     this.loadCharts(app);
        //     // this.createChart(app, "bar");
        //   }, error => {
        //     this.ios.getAPPRatings(app).subscribe((response: any) => {
        //       this.histogram = JSON.parse(response.result).histogram;
        //       this.loadCharts(app);
        //       // this.createChart(app, "bar");
        //     })
        //   })
        // });

        // androidApps.forEach(app => {
        //   this.apps.push({ appName: app, type: 'pie' });
        // })

        // androidApps.forEach(appName => {
        //   this.android.getApp(appName, true).subscribe((response: any) => {
        //     let resp: any = JSON.parse(response.result);
        //     this.histogram = resp.histogram;
        //     this.loadCharts(appName)
        //     // this.createChart(appName, "bar");
        //   }, error=> {
        //     androidApps.forEach(appName => {
        //       this.android.getApp(appName).subscribe((response: any) => {
        //         let resp: any = JSON.parse(response.result);
        //         this.histogram = resp.histogram;
        //         this.loadCharts(appName)
        //         // this.createChart(appName, "bar");
        //       });
        //     })
        //   });
        // })
      }
    })
  }


  loadCharts(app: any) {
    this.loading = true;
    let chartOptions: any = {
      chart: {
        height: 350,
        type: "bar"
      },
      xaxis: {
        type: 'category',
        categories: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
        labels: {
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: '#1C2E4A'
          }
        }
      },
      yaxis: {
        show: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
            offSetY: -20
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            fontWeight: 800,
            colors: ['#1C2E4A'],
            fontFamily: 'Cabin, sans-serif'
          }
        },
      },
      colors: ["#126963", "#0C4642", "#126963", "#188C84", "#1EAEA5"]
    };

    let chartOptions2: any = {
      chart: {
        // width: '350',
        // height: '100%',
        type: "pie"
      },
      labels: ["1★", "2★", "3★", "4★", "5★"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 320
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 1000,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 2160,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 750,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        },
      ],
      theme: {
        monochrome: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          },
          offsetY: -20
        }
      },
      colors: ["#062321", "#0C4642", "#126963", "#188C84", "#1EAEA5"]
    };

    if (!!app) {
      if (app.isIOS) {
        this.ios.getApp(app.appId || app.app).subscribe((resp: any) => {
          this.ios.getAPPRatings(app.appId || app.app).subscribe((response: any) => {
            let histogram = JSON.parse(response.result).histogram;
            let ratings: any[] = Object.values(histogram);
            this.histogram = ratings;
            let total = ratings.reduce((el, ab) => ab + el);
            this.total = total;
            let values = [];
            ratings.forEach(el => {
              values.push(parseFloat(((el * 100) / total).toFixed(2)));
            })

            chartOptions.series = [{
              data: ratings,
              name: "Ratings"
            }];

            chartOptions.app = JSON.parse(resp.result).title;
            chartOptions.isIOS = true;

            chartOptions2.series = values;
            chartOptions2.isIOS = true;
            chartOptions2.app = JSON.parse(resp.result).title;

            this.charts.push({ app: JSON.parse(resp.result).title, type: 'bar', isIOS: app.isIOS, bar: chartOptions, pie: chartOptions2, isVisible: 'bar' });

            setTimeout(() => {
              this.loading = false;
            }, 100);
          })
        })

      } else {
        this.android.getApp(app.appId || app.app).subscribe((resp: any) => {
          console.log(JSON.parse(resp.result));
          let histogram = JSON.parse(resp.result).histogram;
          let ratings: any[] = Object.values(histogram);
          this.histogram = ratings;
          let total = ratings.reduce((el, ab) => ab + el);
          this.total = total;
          let values = [];
          ratings.forEach(el => {
            values.push(parseFloat(((el * 100) / total).toFixed(2)));
          })

          chartOptions.series = [{
            data: ratings,
            name: "Ratings"
          }];

          chartOptions.app = JSON.parse(resp.result).title;
          chartOptions2.series = values;
          chartOptions2.app = JSON.parse(resp.result).title;

          this.charts.push({ app: JSON.parse(resp.result).title, type: 'bar', isIOS: app.isIOS, bar: chartOptions, pie: chartOptions2, isVisible: 'bar' });

          setTimeout(() => {
            this.loading = false;
          }, 10);
        });

      }
    }
  }

  getAppName(app: any): string {
    let name = app;
    this.dataService.getAppName().forEach(appInner => {
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

  changeChart(chart: any) {
    if (chart.isVisible == 'pie') {
      chart.isVisible = 'bar';
    } else {
      chart.isVisible = 'pie';
    }
  }

}
