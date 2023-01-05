import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Input() versions: any[] = [];
  @Input() years: any[] = [];

  @Output() searchKeyword: EventEmitter<string> = new EventEmitter<string>();
  @Output() version: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() ratingFilter : EventEmitter<any> = new EventEmitter<any>();

  public ratings: any[] = [
    { text: 1, isSelected: true },
    { text: 2, isSelected: true },
    { text: 3, isSelected: true },
    { text: 4, isSelected: true },
    { text: 5, isSelected: true }
  ];

  constructor() { }

  ngOnInit(): void {}

  searchInput(event: any) {
    event.preventDefault();
    this.searchKeyword.emit(event.target.value);
  }

  toggleRatingSelection(rate: any) {
    this.ratings.find(rating => { return rating.text == rate.text }).isSelected = !this.ratings.find(rating => { return rating.text == rate.text }).isSelected;
    this.ratingFilter.emit(this.ratings);
  }

  versionSelected(event: any) {
    this.version.emit(event.value);
  }

  yearSelected(event: any) {
    this.year.emit(event.value);
  }
}
