import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public currentApp: any = {};
  private currentPage: string = "";
  private appNames: any[] = [];
  public failedApps: number = 0;
  public totalApps: number = JSON.parse(localStorage.getItem("apps-review") || "[]").length;
  public loadedApps: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public appLoader: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public newAppAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public compareAppAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  setCurrentApp(app: any) {
    this.currentApp = app;
    this.appLoader.next(app);
  }

  getCurrentApp(): any {
    return this.currentApp;
  }

  getCurrentPage(): string {
    return this.currentPage;
  }

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  getAppName():any[] {
    return this.appNames;
  }

  setAppName(appName: any) {
    this.appNames.push(appName);
  }

  getTotalApps() {
    this.totalApps = JSON.parse(localStorage.getItem("apps-review") || "[]").length;
    return this.totalApps;
  }

}
