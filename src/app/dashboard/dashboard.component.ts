import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements AfterViewInit {
  public chart: any;
  private histogram: any = {};
  public apps: any[] = [];
  public type: string = "pie";
  public loading: boolean = true;
  public loadingPercent: number = 0;
  public Math = Math;

  public charts: any[] = [];
  public charts2: any[] = [];

  total: any;

  constructor(public dataService: DataService, private android: AndroidService, private ios: IosService) { }

  ngAfterViewInit(): void {
    this.dataService.loadedApps.subscribe((data: number) => {
      this.loadingPercent = (data * 100) / (this.dataService.getTotalApps() == 0 ? 10 : this.dataService.getTotalApps());
      if (!!data && data > -1 && (data == (this.dataService.getTotalApps() == 0 ? 10 : this.dataService.getTotalApps()) - this.dataService.failedApps)) {

        this.chart?.destroy()
        let iosApps: any[] = []; //this.ios.iosAppsDefault;
        let androidApps: any[] = []; //this.android.androidAppsDefault;

        let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

        apps.forEach((app) => {
          setTimeout(() => {
            this.loadCharts(app);
          }, 100);
        })
      }
    })
  }

  getColor(colorName: string): string {
    const r = document.querySelector(':root');
    const rs = getComputedStyle(r);
    const color = rs.getPropertyValue("--"+colorName);
    return color;
  }

  getColorShades(colorName: string): string[] {
    const root = document.querySelector(':root');
    const rs = getComputedStyle(root);
    const color = rs.getPropertyValue("--"+colorName);

    const [r,g,b] = [
      parseInt(color.substring(1,3), 16),
      parseInt(color.substring(3,5), 16),
      parseInt(color.substring(5,7), 16),
    ];

    const shades = [
      '#' + this.getHexValue(r, 0.1) + this.getHexValue(g, 0.1) + this.getHexValue(b, 0.5),
      '#' + this.getHexValue(r, 0.3) + this.getHexValue(g, 0.3) + this.getHexValue(b, 0.6),
      '#' + this.getHexValue(r, 0.5) + this.getHexValue(g, 0.5) + this.getHexValue(b, 0.7),
      '#' + this.getHexValue(r, 0.7) + this.getHexValue(g, 0.7) + this.getHexValue(b, 0.8),
      '#' + this.getHexValue(r, 0.9) + this.getHexValue(g, 0.9) + this.getHexValue(b, 0.9),
    ];

    console.log(shades)
    return shades;
  }

  getHexValue(r: number, opacity: number) {
    return Math.round(r * opacity).toString(16).length == 2 ? Math.round(r * opacity).toString(16) : '0' + Math.round(r * opacity).toString(16);
  }

  loadCharts(app: any) {
    this.loading = true;
    const ratingColors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e7e34'];

    let chartOptions: any = {
      chart: {
        height: 280,
        type: "bar",
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        legend: {
          show: false
        }
      },
      xaxis: {
        type: 'category',
        categories: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: '600',
            colors: this.getColor('graph')
          }
        }
      },
      yaxis: {
        show: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
            offSetY: -20
          },
          borderRadius: 6,
          columnWidth: '60%',
          distributed: true
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '11px',
            fontWeight: 600,
            colors: [this.getColor('graph')],
            fontFamily: 'Cabin, sans-serif'
          }
        },
      },
      colors: ratingColors,
      grid: {
        show: false
      },
      stroke: {
        width: 0
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            },
            plotOptions: {
              bar: {
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 260
            }
          }
        }
      ]
    };

    let chartOptions2: any = {
      chart: {
        height: 380,
        type: "pie",
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        legend: {
          show: false
        }
      },
      labels: ["1★", "2★", "3★", "4★", "5★"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: "bottom",
              fontSize: '11px'
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 340
            },
            legend: {
              position: "bottom",
              fontSize: '12px'
            }
          }
        },
        {
          breakpoint: 1000,
          options: {
            chart: {
              height: 360
            },
            legend: {
              position: "bottom",
              fontSize: '12px'
            }
          }
        }
      ],
      theme: {
        monochrome: {
          enabled: false
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%'
          },
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return opts.w.globals.seriesTotals[opts.seriesIndex] + '\n(' + val.toFixed(1) + '%)'
        },
        style: {
          fontSize: '10px',
          fontWeight: '600',
          fontFamily: 'Cabin, sans-serif'
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500,
        markers: {
          width: 14,
          height: 14,
          radius: 7
        }
      },
      colors: ratingColors
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

            this.charts.push({ app: JSON.parse(resp.result).title, type: 'bar', isIOS: app.isIOS, bar: chartOptions, pie: chartOptions2, isVisible: 'bar' });;
          })
        })

      } else {
        this.android.getApp(app.appId || app.app).subscribe((resp: any) => {
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

          // setTimeout(() => {
          //   this.loading = false;
          // }, 100);
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
