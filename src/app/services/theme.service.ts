import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('minimal');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'minimal';
    this.setTheme(savedTheme);

    const savedDarkMode = localStorage.getItem('app-dark-mode');
    if (savedDarkMode) {
      this.setDarkMode(savedDarkMode === 'true');
    } else {
      this.setDarkMode(false);
    }
  }

  public setTheme(themeId: string) {
    const themeClasses = ['theme-compact', 'theme-grid', 'theme-expressive', 'theme-minimal', 'theme-glass'];
    themeClasses.forEach(cls => document.body.classList.remove(cls));

    document.body.classList.add(`theme-${themeId}`);
    
    localStorage.setItem('app-theme', themeId);
    this.currentThemeSubject.next(themeId);
  }

  public setDarkMode(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('app-dark-mode', isDark.toString());
    this.isDarkModeSubject.next(isDark);
  }

  public toggleDarkMode() {
    const nextVal = !this.isDarkModeSubject.value;
    this.setDarkMode(nextVal);
  }

  public getTheme(): string {
    return this.currentThemeSubject.value;
  }

  public isDark(): boolean {
    return this.isDarkModeSubject.value;
  }
}
