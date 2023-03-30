import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-reviews',
  templateUrl: './new-reviews.component.html',
  styleUrls: ['./new-reviews.component.css']
})
export class NewReviewsComponent implements OnInit {


  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  public isValid: boolean = this.emailFormControl.errors == null && this.emailFormControl.status == 'VALID';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  mailReviews() {
    if (this.emailFormControl.errors == null && this.emailFormControl.status == 'VALID') {
      let reviews = document.getElementById("review-content")?.innerHTML || "";
      
      this.dataService.sendEmail(reviews, (this.emailFormControl.value || "")).subscribe((response: any) => {
        if (response.opstatus == 0) {
          this.snackbar.open("Mail sent successfully !", "Close", {
            duration: 300, horizontalPosition: "end",
            verticalPosition: "bottom"
          });
        } else {
          this.snackbar.open("Sending mail failed !", "Close", {
            duration: 300, horizontalPosition: "end",
            verticalPosition: "bottom"
          });
        }
      });
    } else {
      this.snackbar.open("Invalid Email address !", "Close", {
        duration: 300, horizontalPosition: "end",
        verticalPosition: "bottom"
      });
    }
  }
}
