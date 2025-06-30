import { Component, OnInit, OnDestroy } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import Chart from 'chart.js/auto';
import { BehaviorSubject } from 'rxjs';
import * as keyword_extractor from "keyword-extractor";
import { Router } from '@angular/router';


@Component({
  selector: 'app-compare-apps',
  templateUrl: './compare-apps.component.html',
  styleUrls: ['./compare-apps.component.css']
})
export class CompareAppsComponent implements OnInit, OnDestroy {

  compareAppsArray: any[] = [];
  public apps: any = {};
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];
  public isIOS: boolean = false;
  public appDetails: any[] = [];
  public chart: any;
  private loadChart: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  sentiments: any;
  words: any[] = [];
  isMobile = false;
  private resizeListener: any;
  private loadChartSubscription: any;

  // Add fields array for expansion panels
  fields = [
    { label: 'Platform', key: 'platform' },
    { label: 'Avg Rating', key: 'rating' },
    { label: 'Developer', key: 'developer' },
    { label: 'Genre', key: 'genre' },
    { label: 'Current Version', key: 'version' },
    { label: 'Release Date', key: 'releaseDate' },
    { label: 'Last Updated', key: 'lastUpdated' },
    { label: 'Number of Reviews', key: 'reviews' },
    { label: 'Number of Ratings', key: 'ratings' },
    { label: 'Top Positive Words', key: 'positive' },
    { label: 'Top Negative Words', key: 'negative' },
    { label: '1★ Ratings', key: 'oneStar' },
    { label: '2★ Ratings', key: 'twoStar' },
    { label: '3★ Ratings', key: 'threeStar' },
    { label: '4★ Ratings', key: 'fourStar' },
    { label: '5★ Ratings', key: 'fiveStar' },
  ];

  constructor(private data: DataService, private ios: IosService, private android: AndroidService, private router: Router) { }

  ngOnInit(): void {
    this.checkMobile();
    this.resizeListener = () => this.checkMobile();
    window.addEventListener('resize', this.resizeListener);
    
    // Set up loadChart subscription outside to avoid recreation
    this.loadChartSubscription = this.loadChart.subscribe((chartNumber: number) => {
      if (chartNumber > 0 && chartNumber === this.compareAppsArray.length) {
        // Use a longer delay and ensure DOM is ready
        setTimeout(() => {
          // Double-check that the canvas element exists
          const canvas = document.getElementById('line-chart');
          if (canvas) {
            this.createChart();
          } else {
            console.log('Canvas element not found, retrying...');
            // Retry after a short delay
            setTimeout(() => {
              this.createChart();
            }, 200);
          }
        }, 300);
      }
    });
    
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
              let reviews: any[] = [];
              this.iosReviews = [];

              this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
                const max = this.getMaxPages(JSON.parse(response.result).feed.link);
                for (let i = 1; i <= max; i++) {
                  this.ios.getAppReviews(app.id, i).subscribe((response: any) => {
                    length += JSON.parse(response.result).feed.entry.length;
                    app.reviews = length;
                    JSON.parse(response.result).feed.entry.forEach((entry:any)=> {
                      reviews.push(entry);
                    })
                    if (i == max) {
                      this.iosReviews = reviews;
                      this.getKeywordData(this.iosReviews, true, app)
                    }
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
            this.getAndroidReviews(app.appId, app);
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
      }
    });
  }

  createChart() {
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    // Check if we have data to display
    if (!this.compareAppsArray || this.compareAppsArray.length === 0) {
      console.log('No data available for chart');
      return;
    }

    // Check if all apps have histogram data
    const appsWithData = this.compareAppsArray.filter(app => app.histogram);
    if (appsWithData.length !== this.compareAppsArray.length) {
      console.log('Waiting for all app data to load...');
      return;
    }

    let dataSets: any[] = [];

    this.compareAppsArray.forEach((app: any) => {
      if (!app.histogram) {
        console.log(`Missing histogram data for app: ${app.name}`);
        return;
      }

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

    if (dataSets.length === 0) {
      console.log('No valid datasets for chart');
      return;
    }

    try {
      this.chart = new Chart('line-chart', {
        type: 'bar',
        data: {
          // values on X-Axis
          labels: ['1★', '2★', '3★', '4★', '5★'],
          datasets: dataSets
        }
      });
    } catch (error) {
      console.error('Failed to create chart:', error);
    }
  }

  refreshChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
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

  getAndroidReviews(appId: string, app: any) {
    this.android.getAppReviews(appId).subscribe((response: any) => {
      this.androidReviews = JSON.parse(response.result).data;
      this.getKeywordData(this.androidReviews, false, app);
    })
  }

  getKeywordData(dataForExtraction: any[], isIOS: boolean, app: any) {
    let array: any[] = [];
    dataForExtraction.forEach((data: any) => {
      if (isIOS) {
        array.push(data?.content?.label)
      } else {
        array.push(data?.text)
      }
    });

    let contentString = array.join(" ");

    let extract = keyword_extractor.default.extract(contentString, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
      return_max_ngrams: 1
    });


    let wordCount: any[] = [];
    extract.forEach((el: any) => {
      let check = false;
      let i: number = 0;

      // check if present
      wordCount.forEach((element, index) => {
        if (element.text == el) {
          check = true;
          i = index;
        }
      });

      // increment number by 1 if present
      if (check) {
        wordCount[i].number = wordCount[i].number + 1
      }
    });

    wordCount.sort((a: any, b: any) => {
      return b.number - a.number;
    });

    let temp: any[] = [];
    wordCount.forEach((el: any, index: number) => {
      if (index < 150) {
        temp.push(el);
      }
    });

    wordCount = temp;

    this.words = wordCount;

    let tempArr: any[] = [];
    array.forEach((el, index) => {
      tempArr.push(el);
    })

    let positiveArray: string[] = [];
    let negativeArray: string[] = [];

    this.ios.sentimentAnalysis(tempArr.length > 0 ? tempArr : array).subscribe((data: any) => {
      let sentArray = data.message;
      sentArray.forEach((el: any) => {
        el.sentiments.positive.forEach((positive: any) => {
          positiveArray.push(positive);
        })
        el.sentiments.negative.forEach((negative: any) => {
          negativeArray.push(negative);
        })
      });

      let showPositive: any[] = [];
      let showNegative: any[] = [];

      positiveArray.forEach((word) => {
        let isPresent: boolean = false;
        showPositive.forEach(present => {
          if (word == present.text) {
            isPresent = true;
            present.number = present.number + 1;
          }
        })

        if (!isPresent) {
          showPositive.push({ text: word, number: 1 });
        }
      });

      negativeArray.forEach((word) => {
        let isPresent: boolean = false;
        showNegative.forEach(present => {
          if (word == present.text) {
            isPresent = true;
            present.number = present.number + 1;
          }
        })

        if (!isPresent) {
          showNegative.push({ text: word, number: 1 });
        }
      });

      showPositive = showPositive.sort((a: any, b: any) => {
        return b.number - a.number;
      })

      showNegative = showNegative.sort((a: any, b: any) => {
        return b.number - a.number;
      })

      let positiveWords = [];
      let negativeWords = [];

      for (let i = 0; i < 5; i++) {
        positiveWords[i] = showPositive[i];
        negativeWords[i] = showNegative[i];
      }

      app.positive = positiveWords;
      app.negative = negativeWords;
    })

  }

  openSentimentReviews(word: string, isPositive: boolean, app: any) {
    let params: any = {};
    params.isComingFrom = "compare";
    params.keyword = word;
    params.app = app;
    if (isPositive) {
      params.ratings = [3, 4, 5];
      params.sentiment = "Positive";
    } else {
      params.ratings = [1, 2, 3];
      params.sentiment = "Negative";
    }
    this.data.selectedSentiment = params;
    this.router.navigate(["/sentiment-reviews"]);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default-app.svg';
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.loadChartSubscription) {
      this.loadChartSubscription.unsubscribe();
    }
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 700;
  }

  getAppFieldValue(app: any, key: string): any {
    switch (key) {
      case 'platform':
        return app.isIOS ? 'IOS' : 'Android';
      case 'positive':
        return app.positive?.map((w: any) => w.text).join(', ');
      case 'negative':
        return app.negative?.map((w: any) => w.text).join(', ');
      case 'releaseDate':
      case 'lastUpdated':
        return app[key] ? (new Date(app[key])).toLocaleDateString() : '';
      case 'rating':
        return app.rating ? app.rating.toFixed(1) : '';
      default:
        return app[key] ?? '';
    }
  }
}