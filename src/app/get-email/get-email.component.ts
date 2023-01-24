import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-get-email',
  templateUrl: './get-email.component.html',
  styleUrls: ['./get-email.component.css']
})
export class GetEmailComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  appsForm = this._formBuilder.group({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let apps: any = {};

    this.data.apps.forEach((app: any) => {
      apps[app.name] = false
    });

    this.appsForm = this._formBuilder.group(apps);
  }

  saveApps() {
    console.log(this.emailFormControl);
    console.table(this.appsForm.value);

    let apps = Object.values(this.appsForm.value);
    let isSelected = false;

    apps.forEach(el=> {
      if(el == true) {
        isSelected = true;
      }
    })

    if(this.emailFormControl?.errors == null && isSelected) {
      // call API
    } else {
      // Show Error
    }
  }

}
