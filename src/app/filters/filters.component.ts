import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
  public showFilters: boolean = true;
  public selectedVersion: string = 'All Versions';
  public selectedYear: string = 'All Years';
  public showFilterButton: boolean = true;
  public openDropdown: string | null = null;
  public ratings: any[] = [
    { text: '1★', value: '1', isSelected: false },
    { text: '2★', value: '2', isSelected: false },
    { text: '3★', value: '3', isSelected: false },
    { text: '4★', value: '4', isSelected: false },
    { text: '5★', value: '5', isSelected: false },
  ];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.showFilters = window.innerWidth > 768;
    this.showFilterButton = true;
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        this.openAI = false;
        // Reset local selection labels when a new app loads
        this.selectedVersion = 'All Versions';
        this.selectedYear = 'All Years';
        this.ratings.forEach(r => r.isSelected = false);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.showFilterButton = true;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  searchInput(event: any) {
    event.preventDefault();
    this.searchKeyword.emit(event.target.value);
  }

  toggleRatingSelection(rate: any) {
    const matched = this.ratings.find((r) => r.text === rate.text);
    if (matched) {
      matched.isSelected = !matched.isSelected;
    }

    let areAnySelected = false;
    this.ratings.forEach((rating: any) => {
      if (rating.isSelected) {
        areAnySelected = true;
      }
    });

    let ratingEmitList = [];
    if (!areAnySelected) {
      ratingEmitList = JSON.parse(JSON.stringify(this.ratings));
      ratingEmitList.forEach((rating: any) => {
        rating.isSelected = true;
      });
      this.ratingFilter.emit(ratingEmitList);
    } else {
      this.ratingFilter.emit(this.ratings);
    }
  }

  toggleDropdown(type: string) {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  selectVersion(ver: any) {
    if (ver === '-1') {
      this.selectedVersion = 'All Versions';
    } else {
      this.selectedVersion = ver != null ? ver.toString() : 'NA';
    }
    this.version.emit(ver);
    this.openDropdown = null;
  }

  selectYear(yr: any) {
    if (yr === '-1') {
      this.selectedYear = 'All Years';
    } else {
      this.selectedYear = yr != null ? yr.toString() : 'NA';
    }
    this.year.emit(yr);
    this.openDropdown = null;
  }

  sortByEmit(str: string) {
    this.sortBy.emit(str);
  }

  openAITools() {
    this.openAI = !this.openAI;
    this.shouldOpenAITools.emit(this.openAI);
  }

  clearFilters() {
    this.searchKeyword.emit('');
    this.version.emit('-1');
    this.year.emit('-1');
    this.selectedVersion = 'All Versions';
    this.selectedYear = 'All Years';
    this.ratings.forEach(r => r.isSelected = false);

    const ratingsCopy = JSON.parse(JSON.stringify(this.ratings));
    ratingsCopy.forEach((rating: any) => {
      rating.isSelected = true;
    });
    this.ratingFilter.emit(ratingsCopy);

    const inputEl = document.querySelector('.filter-input') as HTMLInputElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.openDropdown = null;
    }
  }
}
