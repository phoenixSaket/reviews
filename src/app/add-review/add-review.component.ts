import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {
  public appName: string = "";
  public platform: string = "";

  constructor(private snackbar: MatSnackBar) { }

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
    if(this.appName == "") {
      this.openSnackbar("Please enter an app name !");
    } else {
      if (this.platform == "IOS") {
        this.snackbar.dismiss();
      } else if (this.platform == "Android") {
        this.snackbar.dismiss();
        
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

}
