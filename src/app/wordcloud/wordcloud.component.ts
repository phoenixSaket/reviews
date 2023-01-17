import { Component, OnInit } from '@angular/core';
import * as keyword_extractor from "keyword-extractor";
import { Chart } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { AndroidService } from '../services/android.service';
import { MatDialog } from '@angular/material/dialog';
import { WordDialogComponent } from '../word-dialog/word-dialog.component';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.css']
})
export class WordcloudComponent implements OnInit {
  public chart: any;
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

  constructor(private data: DataService, private ios: IosService, private android: AndroidService, public dialog: MatDialog) { }

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

  appSelected(app: any) {
    this.chart?.destroy();
    this.selectedApp = app;
    this.reviews = [];
    this.array = [];
    this.loading = true;

    if (app.value.isIOS) {
      this.getIOSReviews(app.value);
    } else {
      this.getAndroidReviews(app.value)
    }

  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app.id, 1, true).subscribe((response: any) => {

      const max = this.getMaxPages(JSON.parse(response.result).feed.link);
      for (let i = 1; i <= max; i++) {
        this.reallyGetIosReviews(app.id, i, max);
      }
    }, error => {
      this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.reallyGetIosReviews(app.id, i, max);
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

  reallyGetIosReviews(id: any, page: number, max: number) {
    this.ios.getAppReviews(id, page).subscribe((response: any) => {
      let resp = JSON.parse(response.result).feed.entry;
      resp.forEach((el: any) => {
        this.reviews.push(el);
      })
      if (page == max) {
        this.getKeywordData(this.reviews, true);
      }
    })
  }

  getAndroidReviews(app: any) {
    this.android.getAppReviews(app.id, true).subscribe((response: any) => {
      const resp = JSON.parse(response.result).data;
      resp.forEach((review: any) => {
        this.reviews.push(review.text);
      })
      this.getKeywordData(this.reviews, false);
    }, error => {
      this.android.getAppReviews(app.id).subscribe((response: any) => {
        const resp = JSON.parse(response.result).data;
        resp.forEach((review: any) => {
          this.reviews.push(review.text);
        });
        this.getKeywordData(this.reviews, false);
      })
    })
  }

  generateWordCloud(data: any[], multlipicant: number) {

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

  getKeywordData(dataForExtraction: any[], isIos: boolean) {
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
    this.generateWordCloud(z, multlipicant);
  }


  redraw() {
    this.chart?.destroy();
    this.appSelected(this.selectedApp);
  }

  getWordReport() {
    const dialogRef = this.dialog.open(WordDialogComponent, { data: this.words });
  }
}
