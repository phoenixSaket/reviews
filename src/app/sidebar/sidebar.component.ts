import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public selectedDashboard: boolean = false;
  public selectedAddApp: boolean = false;

  constructor(private data: DataService, private router: Router, private sidebar: SidebarService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.apps.forEach((app: any) => {
      app.shouldDelete = false;
      app.shouldCompare = false;
      app.isSelected = false;
    })
  }

  openApp(app: any) {
    if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
    if (this.selectedDashboard) this.selectedDashboard = !this.selectedDashboard;
    this.apps.forEach((app: any) => {
      app.isSelected = false;
    })
    app.isSelected = true;
    this.data.setCurrentApp(app);
    this.router.navigate(["/reviews"]);

    this.closeSideBar();
  }

  closeSideBar(type?: string) {
    if (type) {
      switch (type) {
        case "dashboard":
          this.selectedDashboard = !this.selectedDashboard;
          if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          })
          break;
        case "addApp":
          this.selectedAddApp = !this.selectedAddApp;
          if (this.selectedDashboard) this.selectedDashboard = !this.selectedDashboard;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          })
          break;
        default:
          break;
      }
    }
    if (screen.width < 500) {
      this.sidebar.closeSidebar();
    }
  }

  deleteApp() {
    this.shouldDelete = !this.shouldDelete;
  }

  selectForDeleting(app: any) {
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
    let tempCompareArray: any[] = [];
    this.apps.forEach((app: any) => {
      if(app.shouldCompare) {
        tempCompareArray.push(app);
      }
    });
    if(tempCompareArray.length <= 1) {
      this.snackBar.open('Atleast 2 apps are required for comparison.', 'close', {duration: 3000, horizontalPosition: 'end', verticalPosition: 'bottom'});
    } else {
      this.data.compareAppAdded.next(tempCompareArray);
      this.compareApp();
      this.router.navigate(["/compare"]);
    }
  }

  deleteOrCompareApp(app: any) {
    if(this.shouldDelete) {
      this.selectForDeleting(app);
      this.openApp(app);
    } else if(this.shouldCompare) {
      this.selectForComparing(app);
    } else {
      this.openApp(app);
    }
  }

  selectForComparing(app: any) {
    let length: number = 0;
    this.apps.forEach((app: any) => {
      if(app.shouldCompare) {
        length = length + 1 ;
      }
    });
    if(length >= 3) {
      if(app.shouldCompare) {
        app.shouldCompare = !app.shouldCompare;
      } else {
        this.snackBar.open('Cannot compare more than 3 apps.', 'close', {duration: 3000, horizontalPosition: 'end', verticalPosition: 'bottom'})
      }
    } else {
      app.shouldCompare = !app.shouldCompare;
    }
    this.apps.forEach((app: any) => {
      app.isSelected = false;
    })
    if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
    if (this.selectedDashboard) this.selectedDashboard = !this.selectedDashboard;
  }
}
