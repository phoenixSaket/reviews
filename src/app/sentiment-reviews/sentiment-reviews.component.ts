import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { AndroidService } from '../services/android.service';

@Component({
  selector: 'app-sentiment-reviews',
  templateUrl: './sentiment-reviews.component.html',
  styleUrls: ['./sentiment-reviews.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentimentReviewsComponent implements AfterViewInit {

  public keyword: string = "";
  public ratings = [
    {
      "text": "1★",
      "value": "1",
      "isSelected": false
    },
    {
      "text": "2★",
      "value": "2",
      "isSelected": false
    },
    {
      "text": "3★",
      "value": "3",
      "isSelected": false
    },
    {
      "text": "4★",
      "value": "4",
      "isSelected": false
    },
    {
      "text": "5★",
      "value": "5",
      "isSelected": false
    }
  ];
  public selectedRatings: number[] = [];
  public reviews: any[] = [];
  public isIOS: boolean = false;
  public isLoading: boolean = true;

  constructor(private data: DataService, private ios: IosService, private android: AndroidService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    if (Object.keys(this.data.selectedSentiment).length > 0) {
      let app = this.data.selectedSentiment.app;
      let appId = "";
      this.isIOS = app.isIOS;
      appId = app.id;
      if (this.isIOS) {
        this.getIOSReviews(appId);
      } else {
        this.getAndroidReviews(appId)
      }
    }
  }

  filteringSentiments() {
    let ratings = JSON.parse(JSON.stringify(this.ratings));
    let selectedRatings = this.data.selectedSentiment.ratings;
    let keyword = this.data.selectedSentiment.keyword;
    this.keyword = keyword;

    ratings.map((rating: any) => {
      selectedRatings.forEach((rate: any) => {
        if (rating.value == rate) {
          rating.isSelected = true;
        }
      })
    });

    this.filterByKeyword(keyword).then((isDone: boolean) => {
      if (isDone) {
        this.filterByRating(ratings).then((isComplete: boolean) => {
          if(isComplete) {
            this.highlight();
          }
        })
      }
    });
  }

  highlight() {
    let titles = Array.from(<HTMLCollection>document.getElementsByClassName('container-sentiment'));
    const regex = new RegExp(this.keyword.toLowerCase(), 'gi');

    titles.forEach(title => {
      let text = title.innerHTML;
      text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
      let newText = text.replace(
        regex,
        '<mark class="highlight">$&</mark>'
      );
      title.innerHTML = newText;
    })
  }

  getIOSReviews(appId: string) {
    this.ios.getAppReviews(appId, 1, true).subscribe(
      (response: any) => {
        this.getMaxPages(JSON.parse(response.result).feed.link).then((max: number) => {
          for (let i = 1; i <= max; i++) {
            this.getIndividualIOSReviews(appId, i, max);
          }
        })
      },
      (error) => {
        this.ios.getAppReviews(appId, 1).subscribe((response: any) => {
          this.getMaxPages(JSON.parse(response.result).feed.link).then((max: number) => {
            for (let i = 1; i <= max; i++) {
              this.getIndividualIOSReviews(appId, i, max);
            }
          })
        });
      }
    );
  }

  getIndividualIOSReviews(appId: string, page: number, max: number) {
    try {
      this.ios.getAppReviews(appId, page, true).subscribe(
        (response: any) => {
          if (JSON.parse(response.result)?.feed?.entry?.length > 0) {
            JSON.parse(response.result).feed.entry.forEach((entry: any) => {
              this.reviews.push(entry);
            });
          }
          if (page == max) {
            this.filteringSentiments();
          }
        },
        (error) => {
          this.ios.getAppReviews(appId, page).subscribe((response: any) => {
            if (JSON.parse(response.result)?.feed?.entry?.length > 0) {
              JSON.parse(response.result).feed.entry.forEach((entry: any) => {
                this.reviews.push(entry);
              });
            }
            if (page == max) {
              this.filteringSentiments();
            }
          });

        }
      );
    } catch (err: any) {
      console.log(err);
    }
  }

  getAndroidReviews(appId: string) {
    this.android.getAppReviews(appId, true).subscribe(
      (response: any) => {
        this.reviews = JSON.parse(response.result).data;
        setTimeout(() => {
          this.filteringSentiments();
        }, 100);
      },
      (error) => {
        this.android.getAppReviews(appId).subscribe(
          (response: any) => {
            this.reviews = JSON.parse(response.result).data;
            setTimeout(() => {
              this.filteringSentiments();
            }, 100);
          },
          (error) => {
            this.android.getAppReviews(appId).subscribe((response: any) => {
              this.reviews = JSON.parse(response.result).data;
              setTimeout(() => {
                this.filteringSentiments();
              }, 100);
            });
          }
        );
      }
    );
  }

  getMaxPages(links: any[]): Promise<any> {
    return new Promise(resolve => {
      let maxPage = 0;
      links.forEach((link: any) => {
        if (link.attributes.rel == 'last') {
          const lk = link.attributes.href;
          const page = lk
            .toString()
            .substring(
              lk.toString().indexOf('page=') + 5,
              lk.toString().indexOf('/', lk.toString().indexOf('page=') + 5)
            );
          maxPage = page;
        }
      });
      resolve(maxPage);
    })
  }

  filterByKeyword(keyword: string): Promise<any> {
    return new Promise(resolve => {
      this.reviews = this.reviews.filter((el: any) => {
        if (this.isIOS) {
          return el.content.label
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
            el.title.label.toLowerCase().includes(keyword.toLowerCase())
        } else {
          return el.text
            .toLowerCase()
            .includes(keyword.toLowerCase());
        }
      })
      resolve(true);
    })
  }

  filterByRating(rating: any[]): Promise<any> {
    return new Promise(resolve => {
      let reviews = JSON.parse(JSON.stringify(this.reviews));
      let temp: any[];
      temp = [];
      rating.forEach((ele: any) => {
          if (this.isIOS) {
            reviews.forEach((el: any) => {
              if (el['im:rating'].label == ele.value && ele.isSelected) {
                temp.push(el);
              }
            });
          } else {
            reviews.forEach((el: any) => {
              if (el.score == ele.value && ele.isSelected) {
                temp.push(el);
              }
            });
        }
      });
  
      this.isLoading = false;
      this.reviews = [];
      this.reviews = temp;
      this.cdr.detectChanges();

      resolve(true);
    })
  }


}
