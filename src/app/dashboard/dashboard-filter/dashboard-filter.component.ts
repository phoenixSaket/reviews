import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface FilterOptions {
  type: string[];
  app: string[];
  platform: string[];
}

@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css']
})
export class DashboardFilterComponent implements OnInit, OnChanges {
  @Input() charts: any[] = [];
  @Input() isFiltering: boolean = false;
  @Output() filterChange = new EventEmitter<FilterOptions>();

  filterForm: FormGroup;
  availableApps: string[] = [];
  availableTypes: string[] = ['All', 'Ratings Distribution', 'Average Ratings Graph', 'Distributed Ratings Graph'];
  availablePlatforms: string[] = ['All', 'iOS', 'Android'];
  openDropdown: string | null = null;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      type: [['All']],
      app: [['All']],
      platform: [['All']]
    });
  }

  ngOnInit(): void {
    this.extractAvailableApps();
    this.setupFilterListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['charts'] && changes['charts'].currentValue) {
      this.extractAvailableApps();
    }
  }

  private extractAvailableApps(): void {
    if (this.charts && this.charts.length > 0) {
      // Get unique app names to avoid duplicates
      const uniqueApps = [...new Set(this.charts.map(chart => chart.app))];
      this.availableApps = ['All', ...uniqueApps];
    }
  }

  private setupFilterListeners(): void {
    this.filterForm.valueChanges.subscribe(filters => {
      this.filterChange.emit(filters);
    });
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      type: ['All'],
      app: ['All'],
      platform: ['All']
    });
  }

  getFilteredCharts(): any[] {
    const filters = this.filterForm.value;
    let filteredCharts = [...this.charts];

    // Filter by app
    if (filters.app !== 'All') {
      filteredCharts = filteredCharts.filter(chart => chart.app === filters.app);
    }

    // Filter by platform
    if (filters.platform !== 'All') {
      filteredCharts = filteredCharts.filter(chart => {
        if (filters.platform === 'iOS') {
          return chart.isIOS === true;
        } else if (filters.platform === 'Android') {
          return chart.isIOS === false;
        }
        return true;
      });
    }

    return filteredCharts;
  }

  getFilteredRatingsCharts(): any[] {
    const filters = this.filterForm.value;
    // This would need to be implemented based on your ratings charts data structure
    return [];
  }

  getFilteredLineCharts(): any[] {
    const filters = this.filterForm.value;
    // This would need to be implemented based on your line charts data structure
    return [];
  }

  // Multi-select methods
  toggleDropdown(type: string): void {
    if (this.isFiltering) return;
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  getSelectedText(type: string): string {
    const selected = this.filterForm.get(type)?.value || [];
    if (selected.includes('All') || selected.length === 0) {
      return 'All';
    }
    if (selected.length === 1) {
      return selected[0];
    }
    return `${selected.length} selected`;
  }

  isAllSelected(type: string): boolean {
    const selected = this.filterForm.get(type)?.value || [];
    const options = this.getOptionsForType(type);
    return selected.includes('All') || selected.length === options.length;
  }

  isOptionSelected(type: string, option: string): boolean {
    const selected = this.filterForm.get(type)?.value || [];
    return selected.includes(option);
  }

  toggleSelectAll(type: string): void {
    const control = this.filterForm.get(type);
    if (!control) return;

    if (this.isAllSelected(type)) {
      control.setValue(['All']);
    } else {
      const options = this.getOptionsForType(type);
      control.setValue(options);
    }
  }

  toggleOption(type: string, option: string): void {
    const control = this.filterForm.get(type);
    if (!control) return;

    const currentValue = control.value || [];
    let newValue: string[];

    if (option === 'All') {
      newValue = ['All'];
    } else {
      // Remove 'All' if it's selected
      const withoutAll = currentValue.filter((v: string) => v !== 'All');
      
      if (currentValue.includes(option)) {
        // Remove the option
        newValue = withoutAll.filter((v: string) => v !== option);
        // If no options selected, default to 'All'
        if (newValue.length === 0) {
          newValue = ['All'];
        }
      } else {
        // Add the option
        newValue = [...withoutAll, option];
      }
    }

    control.setValue(newValue);
  }

  private getOptionsForType(type: string): string[] {
    switch (type) {
      case 'app':
        return this.availableApps;
      case 'platform':
        return this.availablePlatforms;
      case 'type':
        return this.availableTypes;
      default:
        return [];
    }
  }

  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return (values.app && values.app.length > 0 && !values.app.includes('All')) ||
           (values.platform && values.platform.length > 0 && !values.platform.includes('All')) ||
           (values.type && values.type.length > 0 && !values.type.includes('All'));
  }

  getActiveFilters(type: string): string[] {
    const values = this.filterForm.get(type)?.value || [];
    return values.filter((v: string) => v !== 'All');
  }

  removeFilter(type: string, value: string): void {
    this.toggleOption(type, value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.openDropdown = null;
    }
  }
} 