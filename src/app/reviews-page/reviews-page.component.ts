import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.css'],
})
export class ReviewsPageComponent implements OnInit {
  public iosReviews: any[] = [];
  public androidReviews: any[] = [];
  public isIOS: boolean = false;
  public app: any = {};
  public isLoading: boolean = false;
  public versions: number[] = [];
  public years: number[] = [];
  private backup: any[] = [];
  private length: number = 0;
  public versionSorted: any = { sorted: false, type: 'A' };
  public dateSorted: any = { sorted: false, type: 'A' };
  public ratingSorted: any = { sorted: false, type: 'A' };
  private sortingCriteria: any = {};

  constructor(
    public data: DataService,
    private android: AndroidService,
    private ios: IosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.isLoading = true;
        this.versions = [];
        this.years = [];
        this.backup = [];
        if (!this.data.isSnackbarOpen) {
          this.snackBar.open('Reviews loading ...', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        }
        this.app = app;
        this.androidReviews = [];
        this.iosReviews = [];
        if (app.isIOS) {
          this.isIOS = true;
          this.getIOSReviews(app);
        } else {
          this.isIOS = false;
          this.getAndroidReviews(app);
        }
      }
    });
  }

  getAndroidReviews(app: any) {
    this.android.getAppReviews(app.appId, true).subscribe(
      (response: any) => {
        this.androidReviews = JSON.parse(response.result).data;
        this.androidReviews.forEach((review: any) => {
          if (!this.versions.includes(review.version)) {
            this.versions.push(review.version);
          }
          if (!this.years.includes(new Date(review.date).getFullYear())) {
            this.years.push(new Date(review.date).getFullYear());
          }
        });
        this.backup = JSON.parse(JSON.stringify(this.androidReviews));
        this.doSentimentAnalysis();
        this.stopLoading();
      },
      (error) => {
        this.android.getAppReviews(app.appId).subscribe(
          (response: any) => {
            this.androidReviews = JSON.parse(response.result).data;
            this.androidReviews.forEach((review: any) => {
              if (!this.versions.includes(review.version)) {
                this.versions.push(review.version);
              }
              if (!this.years.includes(new Date(review.date).getFullYear())) {
                this.years.push(new Date(review.date).getFullYear());
              }
            });
            this.backup = JSON.parse(JSON.stringify(this.androidReviews));
            this.doSentimentAnalysis();
            this.stopLoading();
          },
          (error) => {
            this.android.getAppReviews(app.appId).subscribe((response: any) => {
              this.androidReviews = JSON.parse(response.result).data;
              this.androidReviews.forEach((review: any) => {
                if (!this.versions.includes(review.version)) {
                  this.versions.push(review.version);
                }
                if (!this.years.includes(new Date(review.date).getFullYear())) {
                  this.years.push(new Date(review.date).getFullYear());
                }
              });
              this.backup = JSON.parse(JSON.stringify(this.androidReviews));
              this.doSentimentAnalysis();
              this.stopLoading();
            });
          }
        );
      }
    );
  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app.id, 1, true).subscribe(
      (response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.storeIOSReviews(app.id, i, max);
        }
      },
      (error) => {
        this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
          const max = this.getMaxPages(JSON.parse(response.result).feed.link);
          for (let i = 1; i <= max; i++) {
            this.storeIOSReviews(app.id, i, max);
          }
        });
      }
    );
  }

  storeIOSReviews(appId: string, page: number, max: number) {
    this.ios.getAppReviews(appId, page, true).subscribe(
      (response: any) => {
        JSON.parse(response.result).feed.entry.forEach((entry: any) => {
          this.iosReviews.push(entry);
          if (!this.versions.includes(entry['im:version'].label)) {
            this.versions.push(entry['im:version'].label);
          }
          if (
            !this.years.includes(new Date(entry.updated.label).getFullYear())
          ) {
            this.years.push(new Date(entry.updated.label).getFullYear());
          }
        });
        this.backup = JSON.parse(JSON.stringify(this.iosReviews));
        if (page == max) {
          this.stopLoading();
          this.doSentimentAnalysis();
        }
      },
      (error) => {
        this.ios.getAppReviews(appId, page).subscribe((response: any) => {
          JSON.parse(response.result).feed.entry.forEach((entry: any) => {
            this.iosReviews.push(entry);
            if (!this.versions.includes(entry['im:version'].label)) {
              this.versions.push(entry['im:version'].label);
            }
            if (
              !this.years.includes(new Date(entry.updated.label).getFullYear())
            ) {
              this.years.push(new Date(entry.updated.label).getFullYear());
            }
          });
          this.backup = JSON.parse(JSON.stringify(this.iosReviews));
          if (page == max) {
            this.stopLoading();
            this.doSentimentAnalysis();
          }
        });
      }
    );
  }

  getMaxPages(links: any[]) {
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
    return maxPage;
  }

  stopLoading() {
    this.isLoading = false;
    if (!this.data.isSnackbarOpen) {
      this.snackBar.open('Reviews loaded', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
  }

  sortSnackbar(message: string) {
    if (!this.data.isSnackbarOpen) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
  }

  sortBy(text: string) {
    switch (text) {
      case 'version':
        if (this.app.isIOS) {
          this.iosReviews.sort((a: any, b: any) => {
            let aVersion = a['im:version'].label.replaceAll('.', '');
            let bVersion = b['im:version'].label.replaceAll('.', '');

            if (this.versionSorted.type == 'A') return aVersion - bVersion;
            else if (this.versionSorted.type == 'D') return bVersion - aVersion;

            return 0;
          });
        } else {
          this.androidReviews.sort((a: any, b: any) => {
            let aVersion = a.version ? parseInt(a.version).toFixed(2) : '0';
            let bVersion = b.version ? parseInt(b.version).toFixed(2) : '0';

            if (a.version == '0') {
              a.version = null;
            }

            if (b.version == '0') {
              b.version = null;
            }

            if (this.versionSorted.type == 'A')
              return parseInt(aVersion) - parseInt(bVersion);
            else if (this.versionSorted.type == 'D')
              return parseInt(bVersion) - parseInt(aVersion);

            return 0;
          });
        }

        this.versionSorted.type = this.versionSorted.type == 'A' ? 'D' : 'A';
        this.versionSorted.sorted = true;
        this.dateSorted.sorted = false;
        this.ratingSorted.sorted = false;
        break;
      case 'rating':
        if (this.app.isIOS) {
          this.iosReviews.sort((a: any, b: any) => {
            return this.ratingSorted.type == 'D'
              ? a['im:rating'].label > b['im:rating'].label
                ? -1
                : 1
              : a['im:rating'].label > b['im:rating'].label
              ? 1
              : -1;
          });
        } else {
          this.androidReviews.sort((a: any, b: any) => {
            return this.ratingSorted.type == 'D'
              ? a.score > b.score
                ? -1
                : 1
              : a.score > b.score
              ? 1
              : -1;
          });
        }

        this.ratingSorted.type = this.ratingSorted.type == 'A' ? 'D' : 'A';
        this.ratingSorted.sorted = true;
        this.dateSorted.sorted = false;
        this.versionSorted.sorted = false;
        break;
      case 'date':
        if (this.app.isIOS) {
          this.iosReviews.sort((a: any, b: any) => {
            return this.dateSorted.type == 'D'
              ? new Date(a.updated.label) > new Date(b.updated.label)
                ? -1
                : 1
              : new Date(a.updated.label) > new Date(b.updated.label)
              ? 1
              : -1;
          });
        } else {
          this.androidReviews.sort((a: any, b: any) => {
            return this.dateSorted.type == 'D'
              ? new Date(a.date) > new Date(b.date)
                ? -1
                : 1
              : new Date(a.date) > new Date(b.date)
              ? 1
              : -1;
          });
        }

        this.dateSorted.type = this.dateSorted.type == 'A' ? 'D' : 'A';
        this.dateSorted.sorted = true;
        this.ratingSorted.sorted = false;
        this.versionSorted.sorted = false;
        break;

      default:
        break;
    }
  }

  sortByMobile(event: any) {
    this.sortBy(event);
  }

  doSentimentAnalysis() {
    let total: string[] = [];
    if (this.isIOS) {
      this.iosReviews.forEach((el: any) => {
        total.push(el.content.label);
      });
      this.ios.sentimentAnalysis(total).subscribe((resp: any) => {
        let array = resp.message;
        this.iosReviews.forEach((review: any) => {
          array.forEach((sentiment: any) => {
            if (review.content.label == sentiment.string) {
              review.sentiment = sentiment.sentiments;
            }
          });
        });
      });
    } else {
      this.androidReviews.forEach((review: any) => {
        total.push(review.text);
      });
      this.android.sentimentAnalysis(total).subscribe((resp: any) => {
        let array = resp.message;
        this.androidReviews.forEach((review: any) => {
          array.forEach((sentiment: any) => {
            if (review.text == sentiment.string) {
              review.sentiment = sentiment.sentiments;
            }
          });
        });
      });
    }
  }

  versionFilter(version: any) {
    if (this.app.isIOS) {
      if (version == -1) {
        // this.iosReviews = this.backup;
      } else {
        this.sortingCriteria['version'] = version;
        this.filterData(true);
      }
    } else {
      this.sortingCriteria['version'] = version;
      this.filterData(false);
    }
  }

  yearFilter(year: any) {
    if (this.app.isIOS) {
      if (year == -1) {
        // this.iosReviews = this.backup;
      } else {
        this.sortingCriteria['year'] = year;
        this.filterData(true);
      }
    } else {
      this.sortingCriteria['year'] = year;
      this.filterData(false);
    }
  }

  searchSort(keyword: any) {
    if (this.app.isIOS) {
      this.sortingCriteria['search'] = keyword;
      this.filterData(true);
    } else {
      this.sortingCriteria['search'] = keyword;
      this.filterData(false);
    }
  }

  ratingFilter(ratingArray: any) {
    let app = '';

    this.sortingCriteria['rating'] = ratingArray;

    this.backup.forEach((el: any) => {
      if (!!el?.score) {
        app = 'android';
      } else if (!!el['im:rating']?.label) {
        app = 'ios';
      }
    });

    if (app == 'android') {
      this.filterData(false);
    } else {
      this.filterData(true);
    }
    // length = this.iosReviews.length + this.androidReviews.length;
    // this.sortSnackbar(length + ' matching reviews');
  }

  filterData(isIOS: boolean) {
    if (isIOS) {
      this.iosReviews = this.backup;
      let rating = !!this.sortingCriteria.rating;
      let year = !!this.sortingCriteria.year;
      let version = !!this.sortingCriteria.version;
      let search = !!this.sortingCriteria.search;

      let switcher = '';

      let filterRating: any[] = [];
      if (!!rating) {
        this.sortingCriteria.rating.forEach((rating: any) => {
          if (rating.isSelected) {
            filterRating.push(rating.value);
          }
        });
      }

      if (!version && !search && year) {
        switcher = 'year';
      } else if (version && !search && !year) {
        switcher = 'version';
      } else if (!version && search && !year) {
        switcher = 'search';
      } else if (version && !search && year) {
        switcher = 'year-version';
      } else if (!version && search && year) {
        switcher = 'year-search';
      } else if (version && search && !year) {
        switcher = 'version-search';
      } else if (version && search && year) {
        switcher = 'all';
      }

      switch (switcher) {
        case 'year':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
              this.sortingCriteria.year
            );
          });
          break;
        case 'version':
          this.iosReviews = this.backup.filter((el: any) => {
            return el['im:version'].label == this.sortingCriteria.version;
          });
          break;
        case 'search':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
              el.title.label.includes(this.sortingCriteria.search)
            );
          });
          break;
        case 'year-version':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
                this.sortingCriteria.year &&
              el['im:version'].label == this.sortingCriteria.version
            );
          });
          break;
        case 'year-search':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
                this.sortingCriteria.year &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.includes(this.sortingCriteria.search))
            );
          });
          break;
        case 'version-search':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              el['im:version'].label == this.sortingCriteria.version &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.includes(this.sortingCriteria.search))
            );
          });
          break;
        case 'all':
          this.iosReviews = this.backup.filter((el: any) => {
            return (
              el['im:version'].label == this.sortingCriteria.version &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.includes(this.sortingCriteria.search)) &&
              new Date(el.updated.label).getFullYear() ==
                this.sortingCriteria.year
            );
          });
          break;
        default:
          break;
      }

      if (filterRating.length > 0) {
        let temp: any[] = [];
        this.iosReviews.forEach((el: any) => {
          filterRating.forEach((rating: any) => {
            if (el['im:rating'].label == rating) {
              temp.push(el);
            }
          });
        });
        this.iosReviews = temp;
      }

      console.log('Filtered', this.iosReviews);
    } else {
      this.androidReviews = this.backup;
      console.log(this.androidReviews);
      let rating = !!this.sortingCriteria.rating;
      let year = !!this.sortingCriteria.year;
      let version = !!this.sortingCriteria.version;
      let search = !!this.sortingCriteria.search;

      let switcher = '';

      let filterRating: any[] = [];
      if (!!rating) {
        this.sortingCriteria.rating.forEach((rating: any) => {
          if (rating.isSelected) {
            filterRating.push(rating.value);
          }
        });
      }

      if (!version && !search && year) {
        switcher = 'year';
      } else if (version && !search && !year) {
        switcher = 'version';
      } else if (!version && search && !year) {
        switcher = 'search';
      } else if (version && !search && year) {
        switcher = 'year-version';
      } else if (!version && search && year) {
        switcher = 'year-search';
      } else if (version && search && !year) {
        switcher = 'version-search';
      } else if (version && search && year) {
        switcher = 'all';
      }

      switch (switcher) {
        case 'year':
          this.androidReviews = this.backup.filter((el: any) => {
            return new Date(el.date).getFullYear() == this.sortingCriteria.year;
          });
          break;
        case 'version':
          this.androidReviews = this.backup.filter((el: any) => {
            return el.version == this.sortingCriteria.version;
          });
          break;
        case 'search':
          this.androidReviews = this.backup.filter((el: any) => {
            return el.text
              .toLowerCase()
              .includes(this.sortingCriteria.search.toLowerCase());
          });
          break;
        case 'year-version':
          this.androidReviews = this.backup.filter((el: any) => {
            return (
              new Date(el.date).getFullYear() == this.sortingCriteria.year &&
              el.version == this.sortingCriteria.version
            );
          });
          break;
        case 'year-search':
          this.androidReviews = this.backup.filter((el: any) => {
            return (
              new Date(el.date).getFullYear() == this.sortingCriteria.year &&
              el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase())
            );
          });
          break;
        case 'version-search':
          this.androidReviews = this.backup.filter((el: any) => {
            return (
              el.version == this.sortingCriteria.version &&
              (el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()))
            );
          });
          break;
        case 'all':
          this.androidReviews = this.backup.filter((el: any) => {
            return (
              el.version == this.sortingCriteria.version &&
              (el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase())) &&
              new Date(el.date).getFullYear() ==
                this.sortingCriteria.year
            );
          });
          break;
        default:
          break;
      }

      if (filterRating.length > 0) {
        let temp: any[] = [];
        this.androidReviews.forEach((el: any) => {
          filterRating.forEach((rating: any) => {
            if (el.score == rating) {
              temp.push(el);
            }
          });
        });
        this.androidReviews = temp;
      }

      console.log('Filtered', this.androidReviews);
    }
  }
}
