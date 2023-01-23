import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-word-dialog',
  templateUrl: './word-dialog.component.html',
  styleUrls: ['./word-dialog.component.css'],
})
export class WordDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    let positiveArray: any[] = [];
    let negativeArray: any[] = [];

    if (!!this.data.sentiments) {
      positiveArray = this.data.sentiments.positive;
      negativeArray = this.data.sentiments.negative;
    }

    this.data.words.forEach((word: any) => {
      if (
        positiveArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check;
        })
      ) {
        word.isPositive = true;
      }

      if (
        negativeArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check;
        })
      ) {
        word.isPositive = false;
      }
    });
  }
}
