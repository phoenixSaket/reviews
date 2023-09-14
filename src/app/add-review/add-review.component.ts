import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  public appName: string = "";
  public platform: string = "IOS";
  public apps: any[] = [];

  constructor(private snackbar: MatSnackBar, private ios: IosService, private android: AndroidService, private data: DataService) { }

  ngOnInit(): void {
  }

  appNameChange(event: any) {
    this.appName = event.target.value;
  }

  platformSelect(event: any) {
    this.platform = event.value;
  }

  searchApp(event: any) {
    event.preventDefault();
    this.apps = [];
    if (this.appName == "") {
      this.openSnackbar("Please enter an app name !");
    } else {

      let term: string = this.appName;
      const num: number = 20;
      const lang: string = "";
      const price: string = "";

      if (this.platform == "IOS") {
        this.snackbar.dismiss();
        this.openSnackbar("Loading ...");
        this.ios.searchApp(term, num, lang, price, true).subscribe((response: any) => {
          if (response.opstatus == 0) {
            this.apps = JSON.parse(response.result);
            this.snackbar.dismiss();
            if (this.apps.length == 0) {
              this.openSnackbar("No apps found with the name " + this.appName);
            }
          } else {
            this.openSnackbar("Could not load " + this.appName)
          }
        }, error => {
          this.ios.searchApp(term, num, lang, price).subscribe((response: any) => {
            if (response.opstatus == 0) {
              this.apps = JSON.parse(response.result);
              this.snackbar.dismiss();
              if (this.apps.length == 0) {
                this.openSnackbar("No apps found with the name " + this.appName);
              }
            } else {
              this.openSnackbar("Could not load " + this.appName)
            }
          }, error => {
            this.openSnackbar("Could not find " + this.appName);
          });
        });
      } else if (this.platform == "Android") {
        this.snackbar.dismiss();
        this.openSnackbar("Loading ...");
        this.android.searchApp(term, num, lang, price, true).subscribe((response: any) => {
          if (response.opstatus == 0) {
            this.apps = JSON.parse(response.result);
            this.snackbar.dismiss();
            if (this.apps.length == 0) {
              this.openSnackbar("No apps found with the name " + this.appName);
            }
          } else {
            this.openSnackbar("Could not load " + this.appName);
          }
        }, error => {
          this.android.searchApp(term, num, lang, price).subscribe((response: any) => {
            if (response.opstatus == 0) {
              this.apps = JSON.parse(response.result);
              this.snackbar.dismiss();
              if (this.apps.length == 0) {
                this.openSnackbar("No apps found with the name " + this.appName);
              }
            } else {
              this.openSnackbar("Could not load " + this.appName);
            }
          })
        });
      } else {
        this.openSnackbar("Please select a platform !");
      }
    }
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, "Close", {
      duration: 3000, horizontalPosition: "end",
      verticalPosition: "bottom",
    })
  }

  addApp(app: any) {
    this.openSnackbar("Adding " + app.title);
    let shouldAddApp: boolean;
    if (this.platform == "IOS") {
      shouldAddApp = this.saveToLocalStorage({ app: app.id, isIOS: this.platform == "IOS" });
      if (shouldAddApp) {
        this.data.totalApps =  JSON.parse(localStorage.getItem("apps-review") || "[]").length;
        this.data.newAppAdded.next({ app: app.id, isIOS: this.platform == "IOS", appName: app.title });
      } else {
        this.openSnackbar("App already present");
      }
    } else {
      shouldAddApp = this.saveToLocalStorage({ app: app.appId, isIOS: this.platform == "IOS" });
      if (shouldAddApp) {
        this.data.totalApps =  JSON.parse(localStorage.getItem("apps-review") || "[]").length;
        this.data.newAppAdded.next({ app: app.appId, isIOS: this.platform == "IOS", appName: app.title });
      } else {
        this.openSnackbar("App already present");
      }
    }
  }

  saveToLocalStorage(app: any) {
    let shouldAddApp: boolean = true;
    let apps = JSON.parse(localStorage.getItem("apps-review") || "[]");

    let check: boolean = false;
    apps.forEach((el: any) => {
      if (el.app == app.app) { check = true; shouldAddApp = false; };
    });

    if (!check) {
      apps.push(app);
    }

    localStorage.setItem("apps-review", JSON.stringify(apps));
    return shouldAddApp;
  }
}
