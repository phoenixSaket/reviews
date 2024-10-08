import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Input() versions: any[] = [];
  @Input() years: any[] = [];
  @Input() versionSorted: any = { sorted: false, type: 'A' };
  @Input() dateSorted: any = { sorted: false, type: 'A' };
  @Input() ratingSorted: any = { sorted: false, type: 'A' };
  
  @Output() searchKeyword: EventEmitter<string> = new EventEmitter<string>();
  @Output() version: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() ratingFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortBy: EventEmitter<string> = new EventEmitter<string>();  
  @Output() shouldOpenAITools: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  openAI: boolean = false;
  public showFilters: boolean = screen.width > 500 ? true : false;
  public showFilterButton: boolean = screen.width < 500 ? true : false;
  public sortingArray: any[] = [
    { value: 'date', text: 'Date' },
    { value: 'rating', text: 'Rating' },
    { value: 'version', text: 'Version' },
  ];

  public ratings: any[] = [
    { text: '1★', value: '1', isSelected: false },
    { text: '2★', value: '2', isSelected: false },
    { text: '3★', value: '3', isSelected: false },
    { text: '4★', value: '4', isSelected: false },
    { text: '5★', value: '5', isSelected: false },
  ];


  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.openAI = false;
      }
    });
  }

  searchInput(event: any) {
    event.preventDefault();
    this.searchKeyword.emit(event.target.value);
  }

  toggleRatingSelection(rate: any) {
    this.ratings.find((rating) => {
      return rating.text == rate.text;
    }).isSelected = !this.ratings.find((rating) => {
      return rating.text == rate.text;
    }).isSelected;

    let areAnySelected = false;
    this.ratings.forEach((rating: any) => {
      if (rating.isSelected) {
        areAnySelected = true;
      }
    });

    let ratings = [];
    if (!areAnySelected) {
      ratings = JSON.parse(JSON.stringify(this.ratings));
      ratings.forEach((rating: any) => {
        rating.isSelected = true;
      });
      this.ratingFilter.emit(ratings);
    } else {
      this.ratingFilter.emit(this.ratings);
    }
  }

  versionSelected(event: any) {
    this.version.emit(event.value);
  }

  yearSelected(event: any) {
    this.year.emit(event.value);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  sortChange(event: any) {
    this.sortBy.emit(event.value);
  }

  sortByEmit(str: string) {
    this.sortBy.emit(str);
  }

  openAITools() {
    this.openAI = !this.openAI;
    if (screen.width <= 768) {
      this.toggleFilters();
    }
    this.shouldOpenAITools.emit(this.openAI);
  }
}
