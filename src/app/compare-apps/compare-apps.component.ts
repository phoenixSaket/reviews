import { Component, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import Chart from 'chart.js/auto';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-compare-apps',
  templateUrl: './compare-apps.component.html',
  styleUrls: ['./compare-apps.component.css']
})
export class CompareAppsComponent implements OnInit {

  compareAppsArray: any[] = [];
  public apps: any = {};
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];
  public isIOS: boolean = false;
  public appDetails: any[] = [];
  public chart: any;
  private loadChart: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  constructor(private data: DataService, private ios: IosService, private android: AndroidService) { }

  ngOnInit(): void {
    this.data.compareAppAdded.subscribe((apps: any[]) => {
      if (!!apps) {
        this.chart?.destroy();
        this.compareAppsArray = apps;
        let chartNumber: number = 0;

        this.compareAppsArray.forEach((app: any, index: number) => {
          if (app.isIOS) {
            this.ios.getApp(app.id, true).subscribe((iosResponse: any) => {
              const data = JSON.parse(iosResponse.result);
              app.developer = data.developer;
              app.reviews = data.reviews;
              app.ratings = "NA";
              app.genre = data.genres.join(", ");
              app.version = data.version;
              app.releaseDate = data.released;
              app.lastUpdated = data.updated;

              let length = 0;
              this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
                const max = this.getMaxPages(JSON.parse(response.result).feed.link);
                for (let i = 1; i <= max; i++) {
                  this.ios.getAppReviews(app.id, i).subscribe((response: any) => {
                    length += JSON.parse(response.result).feed.entry.length;
                    app.reviews = length;
                  });
                }
              });

              this.ios.getAPPRatings(app.id, true).subscribe((ratingResponse: any) => {
                const iosRatings = JSON.parse(ratingResponse.result)
                app.ratings = iosRatings.ratings;
                app.oneStar = iosRatings.histogram["1"];
                app.twoStar = iosRatings.histogram["2"];
                app.threeStar = iosRatings.histogram["3"];
                app.fourStar = iosRatings.histogram["4"];
                app.fiveStar = iosRatings.histogram["5"];
                app.histogram = iosRatings.histogram;

                chartNumber = chartNumber + 1;
                this.loadChart.next(chartNumber);
              }, error => {
                this.ios.getAPPRatings(app.id).subscribe((ratingResponse: any) => {
                  const iosRatings = JSON.parse(ratingResponse.result)
                  app.ratings = iosRatings.ratings;
                  app.oneStar = iosRatings.histogram["1"];
                  app.twoStar = iosRatings.histogram["2"];
                  app.threeStar = iosRatings.histogram["3"];
                  app.fourStar = iosRatings.histogram["4"];
                  app.fiveStar = iosRatings.histogram["5"];
                  app.histogram = iosRatings.histogram;

                  chartNumber = chartNumber + 1;
                  this.loadChart.next(chartNumber);
                })
              });
            }, error => {
              this.ios.getApp(app.id).subscribe((iosResponse: any) => {
                const data = JSON.parse(iosResponse.result);
                app.developer = data.developer;
                app.reviews = data.reviews;
                app.ratings = "NA";
                app.genre = data.genres.join(", ");
                app.version = data.version;
                app.releaseDate = data.released;
                app.lastUpdated = data.updated;

                let length = 0;
                this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
                  const max = this.getMaxPages(JSON.parse(response.result).feed.link);
                  for (let i = 1; i <= max; i++) {
                    this.ios.getAppReviews(app.id, i).subscribe((response: any) => {
                      length += JSON.parse(response.result).feed.entry.length;
                      app.reviews = length;
                    });
                  }
                });

                this.ios.getAPPRatings(app.id).subscribe((ratingResponse: any) => {
                  const iosRatings = JSON.parse(ratingResponse.result)
                  app.ratings = iosRatings.ratings;
                  app.oneStar = iosRatings.histogram["1"];
                  app.twoStar = iosRatings.histogram["2"];
                  app.threeStar = iosRatings.histogram["3"];
                  app.fourStar = iosRatings.histogram["4"];
                  app.fiveStar = iosRatings.histogram["5"];
                  app.histogram = iosRatings.histogram;

                  chartNumber = chartNumber + 1;
                  this.loadChart.next(chartNumber);
                }, error => {
                  this.ios.getAPPRatings(app.id).subscribe((ratingResponse: any) => {
                    const iosRatings = JSON.parse(ratingResponse.result)
                    app.ratings = iosRatings.ratings;
                    app.oneStar = iosRatings.histogram["1"];
                    app.twoStar = iosRatings.histogram["2"];
                    app.threeStar = iosRatings.histogram["3"];
                    app.fourStar = iosRatings.histogram["4"];
                    app.fiveStar = iosRatings.histogram["5"];
                    app.histogram = iosRatings.histogram;

                    chartNumber = chartNumber + 1;
                    this.loadChart.next(chartNumber);
                  })
                });
              })
            })
          } else {
            this.android.getApp(app.appId, true).subscribe((androidResponse: any) => {
              const data = JSON.parse(androidResponse.result);
              app.developer = data.developer;
              app.reviews = data.reviews;
              app.genre = data.genre;
              app.version = data.version;
              app.ratings = data.ratings;
              app.releaseDate = data.released;
              app.lastUpdated = new Date(data.updated);
              app.oneStar = data.histogram["1"];
              app.twoStar = data.histogram["2"];
              app.threeStar = data.histogram["3"];
              app.fourStar = data.histogram["4"];
              app.fiveStar = data.histogram["5"];
              app.histogram = data.histogram;

              chartNumber = chartNumber + 1;
              this.loadChart.next(chartNumber);
            }, error => {
              this.android.getApp(app.appId).subscribe((androidResponse: any) => {
                const data = JSON.parse(androidResponse.result);
                app.developer = data.developer;
                app.reviews = data.reviews;
                app.genre = data.genre;
                app.version = data.version;
                app.ratings = data.ratings;
                app.releaseDate = data.released;
                app.lastUpdated = new Date(data.updated);
                app.oneStar = data.histogram["1"];
                app.twoStar = data.histogram["2"];
                app.threeStar = data.histogram["3"];
                app.fourStar = data.histogram["4"];
                app.fiveStar = data.histogram["5"];
                app.histogram = data.histogram;

                chartNumber = chartNumber + 1;
                this.loadChart.next(chartNumber);
              })
            });
          }
        });

        this.loadChart.subscribe((chartNumber: number) => {
          if (chartNumber == this.compareAppsArray.length) {
            this.createChart();
          }
        })
      }
    });
  }

  createChart() {
    let dataSets: any[] = [];

    this.compareAppsArray.forEach((app: any) => {
      let data: any = { label: "", data: [] };
      data.label = app.name + (app.isIOS ? ' - IOS' : ' - Android');
      let array: number[] = Object.values(app.histogram);
      let total: number = array.reduce((a: number, b: number) => { return a + b });
      let percent: string[] = [];
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        percent.push(((element * 100) / total).toFixed(2));
      }

      data.data = percent;
      data.borderRadius = 2;
      dataSets.push(data);
    });


    this.chart = new Chart('line-chart', {
      type: 'bar',
      data: {
        // values on X-Axis
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: dataSets
      }
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
}
