import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-get-email',
  templateUrl: './get-email.component.html',
  styleUrls: ['./get-email.component.css']
})

export class GetEmailComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.data.apps.forEach((app: any) => {
      app.isSelected = false;
    })
  }

  addApp(app: any) {
    app.isSelectedForEmail = !app.isSelectedForEmail;
  }

  saveApps() {
    let apps = this.data.apps;
    let isSelected = false;
    let selectedApps: any[] = [];

    apps.forEach((el: any) => {
      if (el.isSelectedForEmail == true) {
        isSelected = true;
        selectedApps.push(el);
      }
    })

    if (this.emailFormControl.errors == null && this.emailFormControl.value != "" && isSelected) {
      // call API
      let appsToSend: any[] = [];

      selectedApps.forEach((appInner: any) => {
        appsToSend.push({ name: appInner.name, isIOS: appInner.isIOS, id: appInner.isIOS ? appInner.id : appInner.appId });
      });


      this.dataService.sendMailApi((this.emailFormControl.value || ""), appsToSend).subscribe((resp: any) => {
      })
    } else {
      // Show Error
      const dialogRef = this.dialog.open(ErrorDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

}
