import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

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

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  selectTheme(themeId: string) {
    this.themeService.setTheme(themeId);
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

}

