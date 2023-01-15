import { Component, OnInit } from '@angular/core';
import * as keyword_extractor from "keyword-extractor";
import { Chart } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { AndroidService } from '../services/android.service';

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

  constructor(private data: DataService, private ios: IosService, private android: AndroidService) { }

  ngOnInit(): void {
    Chart.register(WordCloudController, WordElement);
    const apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

    this.data.loadedApps.subscribe((data: any) => {
      if (data == apps.length) {
        this.appNames = (this.data.getAppName());
        this.appNames.forEach((appData: any) => {
          this.apps.push(appData);
        })
      }
    })

    this.loading= false;

  }

  appSelected(app: any) {
    this.chart?.destroy();
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
    console.log(app);
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
              data: data.map((d) => (d.number) * (multlipicant > 1 ? multlipicant : 2)),
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
      if(isIos) {
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
      } else {
        z.push({ text: el, number: 1 })
      }
    });

    let length = z.length;
    let multlipicant = (screen.width - 305) / length;
    this.generateWordCloud(z, multlipicant);
  }

}
