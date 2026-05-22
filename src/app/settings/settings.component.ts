import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public themes = [
    { id: 'compact', name: 'Compact', icon: 'view_compact' },
    { id: 'grid', name: 'Grid', icon: 'grid_view' },
    { id: 'expressive', name: 'Expressive', icon: 'palette' },
    { id: 'minimal', name: 'Minimal', icon: 'crop_square' },
    { id: 'glass', name: 'Glass', icon: 'blur_on' }
  ];

  public currentTheme: string = 'minimal';
  public isDarkMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Optionally retrieve theme from localStorage
    const savedTheme = localStorage.getItem('app-theme') || 'minimal';
    this.currentTheme = savedTheme;

    const savedDarkMode = localStorage.getItem('app-dark-mode');
    if (savedDarkMode) {
      this.isDarkMode = savedDarkMode === 'true';
      if (this.isDarkMode) {
        document.body.classList.add('dark-mode');
      }
    }
  }

  selectTheme(themeId: string) {
    this.currentTheme = themeId;
    localStorage.setItem('app-theme', themeId);
    // Ideally, a theme service should be notified here to apply global CSS changes
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('app-dark-mode', this.isDarkMode.toString());

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

}
