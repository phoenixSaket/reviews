import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SidebarService } from './sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { GetEmailComponent } from '../get-email/get-email.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() apps: any[] = [];
  public shouldDelete: boolean = false;
  public shouldCompare: boolean = false;
  public selectedDashboard: boolean = false;
  public selectedAddApp: boolean = false;
  public selectedWordCloud: boolean = false;
  public selectedSmartWordCloud: boolean = false;
  public isNotMobile: boolean = screen.availWidth > 500;
  private backupSelectedApp: any = {};

  constructor(
    private data: DataService,
    private router: Router,
    private sidebar: SidebarService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.apps.forEach((app: any) => {
      app.shouldDelete = false;
      app.shouldCompare = false;
      app.isSelected = false;
    });
  }

  openApp(app: any) {
    if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
    if (this.selectedDashboard)
      this.selectedDashboard = !this.selectedDashboard;
    if (this.selectedWordCloud)
      this.selectedWordCloud = !this.selectedWordCloud;
    if (this.selectedSmartWordCloud)
      this.selectedSmartWordCloud = !this.selectedSmartWordCloud;
    this.apps.forEach((app: any) => {
      app.isSelected = false;
    });
    app.isSelected = true;
    this.data.setCurrentApp(app);
    this.data.setCurrentPage(app.name);
    this.router.navigate(['/reviews']);

    this.closeSideBar();
  }

  closeSideBar(type?: string) {
    if (type) {
      switch (type) {
        case 'dashboard':
          this.selectedDashboard = !this.selectedDashboard;
          if (this.selectedWordCloud)
            this.selectedWordCloud = !this.selectedWordCloud;
          if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          });
          if (this.selectedSmartWordCloud)
            this.selectedSmartWordCloud = !this.selectedSmartWordCloud;
          this.shouldCompare = false;
          this.shouldDelete = false;
          this.data.setCurrentPage('-1');
          break;
        case 'addApp':
          this.selectedAddApp = !this.selectedAddApp;
          if (this.selectedWordCloud)
            this.selectedWordCloud = !this.selectedWordCloud;
          if (this.selectedDashboard)
            this.selectedDashboard = !this.selectedDashboard;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          });
          if (this.selectedSmartWordCloud)
            this.selectedSmartWordCloud = !this.selectedSmartWordCloud;
          this.shouldCompare = false;
          this.shouldDelete = false;
          this.data.setCurrentPage('-1');
          break;
        case 'wordcloud':
          this.selectedWordCloud = !this.selectedWordCloud;
          if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
          if (this.selectedSmartWordCloud)
            this.selectedSmartWordCloud = !this.selectedSmartWordCloud;
          if (this.selectedDashboard)
            this.selectedDashboard = !this.selectedDashboard;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          });
          this.shouldCompare = false;
          this.shouldDelete = false;
          this.data.setCurrentPage('-1');
          break;
        case 'smartwordcloud':
          this.selectedSmartWordCloud = !this.selectedSmartWordCloud;
          if (this.selectedWordCloud)
            this.selectedWordCloud = !this.selectedWordCloud;
          if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
          if (this.selectedDashboard)
            this.selectedDashboard = !this.selectedDashboard;
          this.apps.forEach((app: any) => {
            app.isSelected = false;
          });
          this.shouldCompare = false;
          this.shouldDelete = false;
          this.data.setCurrentPage('-1');
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
    this.backupSelectedApp = this.apps.find((app: any)=> {return app.isSelected;});
    this.apps.forEach((app) => {
      app.shouldDelete = false;
      app.shouldCompare = false;
      app.isSelected = false;
    });
  }

  selectForDeleting(app: any) {
    app.shouldDelete = !app.shouldDelete;
  }

  reallyDeleteApp() {
    let temp: any[] = [];
    let temp2: any[] = [];
    this.apps.forEach((app: any) => {
      if (app.shouldDelete && app == this.backupSelectedApp) {
        this.router.navigate(['/']);
      }

      if (!app.shouldDelete) {
        temp.push({
          app: app.isIOS ? app.id : app.appId,
          isIOS: app.isIOS == true,
        });
        temp2.push(app);
      }
    });

    if (this.selectedWordCloud)
      this.selectedWordCloud = !this.selectedWordCloud;
    if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
    if (this.selectedDashboard)
      this.selectedDashboard = !this.selectedDashboard;
    this.apps.forEach((app: any) => {
      app.isSelected = false;
    });
    let appsToSave = temp;
    this.apps = temp2;
    localStorage.setItem('apps-review', JSON.stringify(appsToSave));
    this.shouldDelete = !this.shouldDelete;
  }

  compareApp() {
    this.shouldCompare = !this.shouldCompare;
    this.apps.forEach((app) => {
      app.shouldDelete = false;
      app.shouldCompare = false;
    });
  }

  reallyCompareApps() {
    let tempCompareArray: any[] = [];
    this.apps.forEach((app: any) => {
      if (app.shouldCompare) {
        tempCompareArray.push(app);
      }
    });
    if (tempCompareArray.length <= 1) {
      if (!this.data.isSnackbarOpen) {
        this.snackBar.open(
          'Atleast 2 apps are required for comparison.',
          'close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          }
        );
      }
    } else {
      if (this.selectedWordCloud)
        this.selectedWordCloud = !this.selectedWordCloud;
      if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
      if (this.selectedDashboard)
        this.selectedDashboard = !this.selectedDashboard;
      this.apps.forEach((app: any) => {
        app.isSelected = false;
      });
      this.data.compareAppAdded.next(tempCompareArray);
      this.compareApp();
      if (screen.width < 500) {
        this.sidebar.closeSidebar();
      }
      this.router.navigate(['/compare']);
    }
  }

  deleteOrCompareApp(app: any) {
    if (this.shouldDelete) {
      this.selectForDeleting(app);
    } else if (this.shouldCompare) {
      this.selectForComparing(app);
    } else {
      this.openApp(app);
    }
  }

  selectForComparing(app: any) {
    let length: number = 0;
    this.apps.forEach((app: any) => {
      if (app.shouldCompare) {
        length = length + 1;
      }
    });
    if (
      (screen.width > 500 && length >= 3) ||
      (screen.width < 500 && length >= 2)
    ) {
      if (app.shouldCompare) {
        app.shouldCompare = !app.shouldCompare;
      } else {
        if (!this.data.isSnackbarOpen) {
          this.snackBar.open(
            'Cannot compare more than ' + length + ' apps.',
            'close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
            }
          );
        }
      }
    } else {
      app.shouldCompare = !app.shouldCompare;
    }
    this.apps.forEach((app: any) => {
      app.isSelected = false;
    });
    if (this.selectedAddApp) this.selectedAddApp = !this.selectedAddApp;
    if (this.selectedDashboard)
      this.selectedDashboard = !this.selectedDashboard;
  }

  openEmailDialog() {
    const dialogRef = this.dialog.open(GetEmailComponent, {
      data: { apps: this.apps },
    });
  }
}
