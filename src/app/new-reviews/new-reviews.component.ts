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
    console.log(this.data);
  }

  mailReviews() {
    if (this.emailFormControl.errors == null && this.emailFormControl.status == 'VALID') {
      let reviews = document.getElementById("review-content")?.innerHTML || "";
      let html = `
      <html>
        <head>
          <style>
          .app-title {
            width: 100%;
            background-color: var(--accent);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
        }
        
        
        .bold {
            font-weight: 700;
        }
        
        .app {
            border: 2px solid var(--accent);
            margin: 5px 0;
        }
        
        .no-height {
            border: none;
            height: 0px;
            display: none;
        }
        
        .green {
            background-color: var(--accent-dark);
            color: var(--accent);
        }
        
        .red {
            background-color: var(--red);
            color: var(--accent);
        }
        
        .action {
            gap: 10px;
        }

        .card {
          width: 100%;
          display: flex;
          padding: 10px;
          border-radius: 5px;
          margin: 3px 0px;
          background-color: white;
      }
      
      .left {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 20%;
      }
      
      .center {
          width: 65%;
          gap: 2px;
      }
      
      .right {
          display: flex;
          flex-direction: column;
          width: 15%;
      }
      
      .stars-container {
          display: flex;
      }
      
      .rate span {
          color: #818181;
          font-size: 20px;
          line-height: 20px;
      }
      
      .title {
          font-weight: 600;
          font-size: 16px;
      }
      
      .content,
      .date,
      .version {
          color: #747474;
      }
      
      .content,
      .date,
      .author,
      .version {
          font-size: 14px;
      }
      
      .user-img {
        display: none;
      }
      
      .sentiment-container {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 10px;
      }
      
      .chip {
          padding: 5px 20px;
          border-radius: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: default;
      }
      
      .basic {
          background-color: var(--active);
          color: white;
      }
      
      .red {
          background-color: #e18888;
          color: white;
      }
      
      .green {
          background-color: #6cc297;
          color: white;
      }
      
      @media (max-width: 500px) {
          .right {
              width: 100%;
              align-items: end;
          }
      
          .left {
              width: 100;
              flex-direction: row;
          }
      
          .center {
              width: 100%
          }
      
          .card {
              flex-direction: column;
          }
      
          .d-flex {
              display: flex;
          }
      
          .column {
              flex-direction: column;
          }
      
          .gap-10 {
              gap: 10px;
          }
      
          .w-100 {
              width: 100%
          }
      
          .image {
              display: none;
          }
      
          .m-b-10 {
              margin-bottom: 10px;
          }
      
          .space-between {
              justify-content: space-between;
          }
      
          .align-center {
              align-items: center;
          }
      }
      * {
      cursor: default;
  }
  
  .card {
      width: 100%;
      display: flex;
      padding: 10px;
      border-radius: 5px;
      margin: 3px 0px;
      background-color: white;
  }
  
  .left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 20%;
  }
  
  .center {
      width: 65%;
      gap: 2px;
  }
  
  .right {
      display: flex;
      flex-direction: column;
      width: 15%;
  }
  
  .stars-container {
      display: flex;
  }
  
  .rate span {
      color: #818181;
      font-size: 20px;
      line-height: 20px;
  }
  
  .title {
      font-weight: 600;
      font-size: 16px;
  }
  
  .content,
  .date,
  .version {
      color: #747474;
  }
  
  .content,
  .date,
  .author,
  .version {
      font-size: 14px;
  }
  
  .user-img {
      display: none;
  }
  
  .sentiment-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 10px;
  }
  
  .chip {
      padding: 5px 20px;
      border-radius: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: default;
  }
  
  .basic {
      background-color: var(--active);
      color: white;
  }
  
  .red {
      background-color: #e18888;
      color: white;
  }
  
  .green {
      background-color: #6cc297;
      color: white;
  }
  
  @media (max-width: 500px) {
      .right {
          width: 100%;
          align-items: end;
      }
  
      .left {
          width: 100;
          flex-direction: row;
          justify-content: space-between;
      }
  
      .center {
          width: 100%
      }
  
      .card {
          flex-direction: column;
      }
  
      .d-flex {
          display: flex;
      }
  
      .column {
          flex-direction: column;
      }
  
      .gap-10 {
          gap: 10px;
      }
  
      .w-100 {
          width: 100%;
      }
  
      .image {
          display: none;
      }
  
      .m-b-10 {
          margin-bottom: 10px;
      }
  
      .space-between {
          justify-content: space-between;
      }
  
      .align-center {
          align-items: center;
      }
  }
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Cabin, sans-serif;
}

:root {
  --accent: #E9F5F3;
  --accent-dark: #198b83;
  --accent-other: #1ca58e;
  --active: #6DBCB7;
  --green: #6cc297;
  --red: #e18888;
  --mat-mdc-snack-bar-button-color: var(--accent) !important;
  --mdc-snackbar-container-color: var(--active) !important;
}

.mat-snack-bar-container {
  color: white;
  background: var(--accent-dark);
}

.mat-simple-snackbar-action {
  color: var(--accent);
}

.mat-simple-snackbar {
  font-size: 16px;
}
.body {
  background-color: #ededed;
  overflow: hidden;
}

.shadow,
.shadows {
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
}


::-webkit-scrollbar {
  width: 5px;
  border-radius: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* html, body { height: 100%; } */
body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}

.mat-form-field-wrapper {
  padding-bottom: 0;
}

.mat-chip-list-wrapper {
  justify-content: center;
}

.checkbox>.material-icons {
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}

.bold {
  font-weight: 700;
}

.filter-button span.mat-button-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.mat-radio-button.mat-accent .mat-radio-inner-circle,
.mat-radio-button.mat-accent .mat-radio-ripple .mat-ripple-element:not(.mat-radio-persistent-ripple),
.mat-radio-button.mat-accent.mat-radio-checked .mat-radio-persistent-ripple,
.mat-radio-button.mat-accent:active .mat-radio-persistent-ripple {
  background-color: var(--active);
}

.mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle {
  border-color: var(--active);
}

.mat-focused {
  border-color: var(--active);
  color: black;
}

.mat-form-field-appearance-outline .mat-form-field-outline-start,
.mat-form-field-appearance-outline .mat-form-field-outline-end {
  border: 1px solid var(--active);
}

.email>.mat-form-field-wrapper {
  width: 100%;
  max-width: 400px;
}

span.mat-checkbox-label {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
          </style>
          <meta charset="utf-8">
  <title>Review Dashboard</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
  href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
  rel="stylesheet">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
        <head>
        <body>
          ${reviews}
        </body>
      </html>`;
      this.dataService.sendEmail(html, (this.emailFormControl.value || "")).subscribe((response: any) => {
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
