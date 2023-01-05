import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() apps: any[] = [];
  public shouldDelete: boolean = false;
  public shouldCompare: boolean = false;

  constructor(private data: DataService, private router: Router, private sidebar: SidebarService) { }

  ngOnInit(): void {
    this.apps.forEach((app: any) => {
      app.shouldDelete = false;
    })
  }

  openApp(app: any) {
    this.data.setCurrentApp(app);
    this.router.navigate(["/reviews"]);

    this.closeSideBar();
  }

  closeSideBar() {
    if (screen.width < 500) {
      this.sidebar.closeSidebar();
    }
  }

  deleteApp() {
    this.shouldDelete = !this.shouldDelete;
  }

  selectForDeleting(app: any) {
    console.log(app);
    app.shouldDelete = !app.shouldDelete;
  }

  reallyDeleteApp() {
    let temp: any[] = [];
    let temp2: any[] = [];
    this.apps.forEach((app: any) => {
      if (!app.shouldDelete) {
        temp.push({ app: app.isIOS ? app.id : app.appId, isIOS: app.isIOS == true });
        temp2.push(app);
      }
    });

    let appsToSave = temp;
    this.apps = temp2;
    localStorage.setItem("apps-review", JSON.stringify(appsToSave));
    this.shouldDelete = !this.shouldDelete;
    // window.location.reload();
  }

  compareApp() {
    this.shouldCompare = !this.shouldCompare;
  }

  reallyCompareApps() {
    this.router.navigate(["/compare"]);
  }
}
