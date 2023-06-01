import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import * as keyword_extractor from "keyword-extractor";
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { WordDialogComponent } from '../word-dialog/word-dialog.component';

@Component({
  selector: 'app-sentiment-cloud',
  templateUrl: './sentiment-cloud.component.html',
  styleUrls: ['./sentiment-cloud.component.css'],
})
export class SentimentCloudComponent implements OnInit {
  public chart: any;
  public positiveChart: any;
  public negativeChart: any;
  private appNames: any[] = [];
  public apps: any[] = [];
  private array: any[] = [];
  private reviews: any[] = [];
  public loading: boolean = false;
  public selectedApp: any = null;
  public words: any[] = [];
  public shouldWait: boolean = true;
  public currentApp: number = 0;
  public totalApps: number = 0;
  public multiplicant1: number = 0;
  public sentiments: any;
  public showOne: boolean = true;

  constructor(
    private data: DataService,
    private ios: IosService,
    private android: AndroidService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    Chart.register(WordCloudController, WordElement);
    this.totalApps = this.data.getTotalApps();

    this.data.loadedApps.subscribe((data: any) => {
      this.currentApp = data;
      if (data == this.totalApps) {
        this.shouldWait = false;
        this.appNames = (this.data.getAppName());
        this.appNames.forEach((appData: any) => {
          this.apps.push(appData);
        })
      }
    })

    this.loading = false;
  }

  appSelected(app: any, type: string = "multiple") {
    this.chart?.destroy();
    this.positiveChart?.destroy();
    this.negativeChart?.destroy();
    this.selectedApp = app;
    this.reviews = [];
    this.array = [];
    this.loading = true;

    if (app.value.isIOS) {
      this.getIOSReviews(app.value, 1, type);
    } else {
      this.getAndroidReviews(app.value, type)
    }

  }

  getIOSReviews(app: any, page: number = 1, type: string) {
    this.ios.getAppReviews(app.id, 1, true).subscribe((response: any) => {

      const max = this.getMaxPages(JSON.parse(response.result).feed.link);
      for (let i = 1; i <= max; i++) {
        this.reallyGetIosReviews(app.id, i, max, type);
      }
    }, error => {
      this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.reallyGetIosReviews(app.id, i, max, type);
        }
      });
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

  reallyGetIosReviews(id: any, page: number, max: number, type: string) {
    this.ios.getAppReviews(id, page).subscribe((response: any) => {
      let resp = JSON.parse(response.result)?.feed?.entry;
      if (resp?.length > 0) {
        resp.forEach((el: any) => {
          this.reviews.push(el);
        })
      }
      if (page == max) {
        setTimeout(() => {
          this.getKeywordData(this.reviews, true, type);
        }, 200);
      }
    })
  }

  getAndroidReviews(app: any, type: string) {
    this.android.getAppReviews(app.id, true).subscribe((response: any) => {
      const resp = JSON.parse(response.result).data;
      resp.forEach((review: any) => {
        this.reviews.push(review.text);
      })
      this.getKeywordData(this.reviews, false, type);
    }, error => {
      this.android.getAppReviews(app.id).subscribe((response: any) => {
        const resp = JSON.parse(response.result).data;
        resp.forEach((review: any) => {
          this.reviews.push(review.text);
        });
        this.getKeywordData(this.reviews, false, type);
      })
    })
  }

  generateWordCloud(data: any[], multlipicant: number) {
    this.multiplicant1 = multlipicant;

    setTimeout(() => {
      const config = {
        data: {
          // text
          labels: data.map((d) => d.text),
          datasets: [
            {
              label: '',
              fit: false,
              maintainAspectRatio: true,
              // size in pixel
              data: data.map((d) => (d.number) * (this.multiplicant1)),
            },
          ]
        }
      };
      const canvas = <HTMLCanvasElement>(document.getElementById('canvas'));
      const ctx = canvas?.getContext('2d') || "canvas";
      this.chart = new Chart('canvas', {
        type: WordCloudController.id,
        data: config.data,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          datasets: {
            wordCloud: {
              rotate: 0,
              padding: 3,
              fit: true,
              rotationSteps: 0,
              color: "#6DBCB7",
              showTooltips: false
            },
          }
        }
      });
      this.loading = false;
    }, 100);
  }

  generateSentimentWordCloud(data: any[], multlipicant: number, type: string) {

    setTimeout(() => {
      const config = {
        data: {
          // text
          labels: data.map((d) => d.text),
          datasets: [
            {
              label: '',
              fit: false,
              maintainAspectRatio: true,
              // size in pixel
              data: data.map((d) => (d.number) * (multlipicant)),
            },
          ]
        }
      };
      const canvas = <HTMLCanvasElement>(document.getElementById('positive-canvas'));
      const ctx = canvas?.getContext('2d') || "canvas";
      let x = new Chart(ctx, {
        type: WordCloudController.id,
        data: config.data,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          datasets: {
            wordCloud: {
              rotate: 0,
              padding: 3,
              fit: true,
              rotationSteps: 0,
              color: type == "single" ? data.map((d) => {
                if (d.isPositive == null) {
                  return "#F9D28B"
                } else if (d.isPositive) {
                  return "#007A58"
                } else {
                  return "#E74B58"
                }
              })
                : ['#007A58', '#E74B58'],
              showTooltips: false
            },
          }
        }
      });

      this.positiveChart = x;
      this.loading = false;
    }, 100);
  }

  reduceSize() {
    this.multiplicant1 -= 1;
    this.chart?.update();
  }

  getKeywordData(dataForExtraction: any[], isIos: boolean, type: string) {
    this.array = [];
    dataForExtraction.forEach((ent: any) => {
      if (isIos) {
        this.array.push(ent?.content?.label);
      } else {
        this.array.push(ent);
      }
    })

    let contentString = this.array.join(" ");

    let extract = keyword_extractor.default.extract(contentString, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
      return_max_ngrams: 1
    });
    let z: any[] = [];
    extract.forEach((el: any) => {
      let check = false;
      let i: number = 0;
      z.forEach((element, index) => {
        if (element.text == el) {
          check = true;
          i = index;
        }
      });
      if (check) {
        z[i].number = z[i].number + 1
      } else if (el !== 'app' && el != "apps" && el != this.selectedApp.value.appName.toLowerCase()) {
        z.push({ text: el, number: 1 })
      }
    });

    if (z.length > 100) {
      z.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      let temp: any[] = [];
      z.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      z = temp;
    }

    this.words = z;

    let length = z[0].number;
    let multlipicant = (1024) / (length * 9);
    multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
    multlipicant = multlipicant < 20 ? multlipicant : 20;
    if (type == "single") {
      this.generateWordCloud(z, multlipicant);
    }
    let tempArr: any[] = [];
    if (this.array.length > 150) {
      this.array.forEach((el, index) => {
        if (index < 150) {
          tempArr.push(el);
        }
      })
    }
    this.ios.sentimentAnalysis(tempArr.length > 0 ? tempArr : this.array).subscribe((data: any) => {
      let sentArray = data.message;
      let positiveArray: string[] = [];
      let negativeArray: string[] = [];
      sentArray.forEach((el: any) => {
        el.sentiments.positive.forEach((positive: any) => {
          positiveArray.push(positive);
        })
        el.sentiments.negative.forEach((negative: any) => {
          negativeArray.push(negative);
        })
      });

      let tempArray: any[] = [];

      positiveArray.forEach((el: any) => {
        let check = false;
        let i: number = 0;
        tempArray.forEach((element, index) => {
          if (element.text == el) {
            check = true;
            i = index;
          }
        });
        if (check) {
          tempArray[i].number = tempArray[i].number + 1
        } else if (el !== 'app' && el != "apps" && el != this.selectedApp.value.appName.toLowerCase()) {
          tempArray.push({ text: el, number: 1, isPositive: true })
        }
      });

      tempArray.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      let temp: any[] = [];
      tempArray.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      tempArray = temp;
      let arrayNew: any = {};
      arrayNew["positive"] = tempArray;
      tempArray = [];
      negativeArray.forEach((el: any) => {
        let check = false;
        let i: number = 0;
        tempArray.forEach((element, index) => {
          if (element.text == el) {
            check = true;
            i = index;
          }
        });
        if (check) {
          tempArray[i].number = tempArray[i].number + 1
        } else if (el !== 'app' && el != "apps" && el != this.selectedApp.value.appName.toLowerCase()) {
          tempArray.push({ text: el, number: 1, isPositive: false })
        }
      });

      tempArray.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      temp = [];
      tempArray.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      tempArray = temp;

      arrayNew["negative"] = tempArray;
      this.sentiments = arrayNew;
      let array1 = arrayNew.positive,
        array2 = arrayNew.negative,
        result = [],
        i, l = Math.min(array1.length, array2.length);

      for (i = 0; i < l; i++) {
        result.push(array1[i], array2[i]);
      }
      result.push(...array1.slice(l), ...array2.slice(l));

      if (result.length > 150) {
        let y: any[] = [];
        result.forEach((el, index) => {
          if (index < 150) {
            y.push(el);
          }
        });
        result = y;
      }

      positiveArray = arrayNew.positive;
      negativeArray = arrayNew.negative;

      z.forEach((word: any) => {
        if (positiveArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check
        })) {
          word.isPositive = true
        }

        if (negativeArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check
        })) {
          word.isPositive = false
        }
      })

      if (type == "single") {
        this.showOne = false;
        let length = result[0].number;
        let multlipicant = (1024) / (length * 9);
        multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
        multlipicant = multlipicant < 20 ? multlipicant : 20;
        this.generateSentimentWordCloud(result, multlipicant, "multiple");
      } else {
        let length = z[0].number;
        let multlipicant = (1024) / (length * 9);
        multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
        multlipicant = multlipicant < 20 ? multlipicant : 20;
        this.generateSentimentWordCloud(z, multlipicant, "single");
        this.showOne = true;
      }
    });
  }

  redraw() {
    this.chart?.destroy();
    this.appSelected(this.selectedApp);
  }

  getWordReport() {
    const dialogRef = this.dialog.open(WordDialogComponent, { data: { words: this.words, sentiments: this.sentiments } });
  }

  separateClouds() {
    if (this.showOne) {
      this.appSelected(this.selectedApp, "single");
    } else {
      this.appSelected(this.selectedApp, "multiple");
    }
  }
}
