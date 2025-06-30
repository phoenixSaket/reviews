import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/data.service';
import { SidebarService } from './sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { GetEmailComponent } from '../get-email/get-email.component';

interface App {
  id?: string;
  appId?: string;
  name: string;
  isIOS: boolean;
  shouldDelete: boolean;
  shouldCompare: boolean;
  isSelected: boolean;
}

interface SidebarState {
  shouldDelete: boolean;
  shouldCompare: boolean;
  selectedDashboard: boolean;
  selectedAddApp: boolean;
  selectedWordCloud: boolean;
  selectedSmartWordCloud: boolean;
  selectedDocumentation: boolean;
  selectedChat: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() apps: App[] = [];
  
  public state: SidebarState = {
    shouldDelete: false,
    shouldCompare: false,
    selectedDashboard: false,
    selectedAddApp: false,
    selectedWordCloud: false,
    selectedSmartWordCloud: false,
    selectedDocumentation: false,
    selectedChat: false
  };
  
  public isNotMobile: boolean = screen.availWidth > 768;
  private backupSelectedApp: App | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public data: DataService,
    private router: Router,
    public sidebar: SidebarService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeApps();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeApps(): void {
    this.apps.forEach((app: App) => {
      app.shouldDelete = false;
      app.shouldCompare = false;
      app.isSelected = false;
    });
  }

  private resetAllSelections(): void {
    Object.keys(this.state).forEach(key => {
      if (key !== 'shouldDelete' && key !== 'shouldCompare') {
        (this.state as any)[key] = false;
      }
    });
    
    this.apps.forEach((app: App) => {
      app.isSelected = false;
      app.shouldDelete = false;
      app.shouldCompare = false;
    });
    
    this.data.setCurrentPage('-1');
  }

  private resetAllSelectionsExceptDeleteCompare(): void {
    Object.keys(this.state).forEach(key => {
      if (key !== 'shouldDelete' && key !== 'shouldCompare') {
        (this.state as any)[key] = false;
      }
    });
    
    this.apps.forEach((app: App) => {
      app.isSelected = false;
      app.shouldDelete = false;
      app.shouldCompare = false;
    });
    
    this.data.setCurrentPage('-1');
  }

  openApp(app: App): void {
    this.resetAllSelections();
    app.isSelected = true;
    this.data.setCurrentApp(app);
    this.data.setCurrentPage(app.name);
    this.router.navigate(['/reviews']);
    this.closeSideBar();
  }

  closeSideBar(type?: string): void {
    if (type) {
      this.resetAllSelections();
      this.setActiveSection(type);
    }

    if (screen.width < 768) {
      this.sidebar.closeSidebar();
    }
  }

  private setActiveSection(type: string): void {
    const sectionMap: { [key: string]: keyof SidebarState } = {
      'dashboard': 'selectedDashboard',
      'addApp': 'selectedAddApp',
      'wordcloud': 'selectedWordCloud',
      'smartwordcloud': 'selectedSmartWordCloud',
      'docs': 'selectedDocumentation',
      'chat': 'selectedChat'
    };

    const section = sectionMap[type];
    if (section) {
      this.state[section] = true;
    }
  }

  deleteApp(): void {
    this.state.shouldDelete = !this.state.shouldDelete;
    this.backupSelectedApp = this.apps.find((app: App) => app.isSelected) || null;
    this.resetAllSelectionsExceptDeleteCompare();
  }

  selectForDeleting(app: App): void {
    app.shouldDelete = !app.shouldDelete;
  }

  reallyDeleteApp(): void {
    const appsToKeep: App[] = [];
    const appsToSave: Array<{ app: string; isIOS: boolean }> = [];

    this.apps.forEach((app: App) => {
      if (app.shouldDelete && app === this.backupSelectedApp) {
        this.router.navigate(['/']);
        return;
      }

      if (!app.shouldDelete) {
        appsToKeep.push(app);
        appsToSave.push({
          app: app.isIOS ? app.id! : app.appId!,
          isIOS: app.isIOS
        });
      }
    });

    this.resetAllSelections();
    this.apps = appsToKeep;
    localStorage.setItem('apps-review', JSON.stringify(appsToSave));
    this.state.shouldDelete = false;
  }

  compareApp(): void {
    this.state.shouldCompare = !this.state.shouldCompare;
    this.resetAllSelectionsExceptDeleteCompare();
  }

  reallyCompareApps(): void {
    const selectedApps = this.apps.filter((app: App) => app.shouldCompare);
    
    if (selectedApps.length <= 1) {
      this.showSnackBar('At least 2 apps are required for comparison.');
      return;
    }

    this.resetAllSelections();
    this.data.compareAppAdded.next(selectedApps);
    this.state.shouldCompare = false;
    
    if (screen.width < 768) {
      this.sidebar.closeSidebar();
    }
    this.router.navigate(['/compare']);
  }

  deleteOrCompareApp(app: App): void {
    if (this.state.shouldDelete) {
      this.selectForDeleting(app);
    } else if (this.state.shouldCompare) {
      this.selectForComparing(app);
    } else {
      this.openApp(app);
    }
  }

  selectForComparing(app: App): void {
    const selectedCount = this.apps.filter((app: App) => app.shouldCompare).length;
    const maxAllowed = this.isNotMobile ? 3 : 2;

    if (selectedCount >= maxAllowed) {
      if (app.shouldCompare) {
        app.shouldCompare = false;
      } else {
        this.showSnackBar(`Cannot compare more than ${maxAllowed} apps.`);
      }
    } else {
      app.shouldCompare = !app.shouldCompare;
    }

    // Only reset other selections, not the shouldCompare flag
    Object.keys(this.state).forEach(key => {
      if (key !== 'shouldDelete' && key !== 'shouldCompare') {
        (this.state as any)[key] = false;
      }
    });
    
    this.apps.forEach((app: App) => {
      app.isSelected = false;
    });
  }

  private showSnackBar(message: string): void {
    if (!this.data.isSnackbarOpen) {
      this.snackBar.open(message, 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
  }

  openEmailDialog(): void {
    this.dialog.open(GetEmailComponent, {
      data: { apps: this.apps },
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default-app.svg';
  }

  // Getters for template access
  get shouldDelete(): boolean { return this.state.shouldDelete; }
  get shouldCompare(): boolean { return this.state.shouldCompare; }
  get selectedDashboard(): boolean { return this.state.selectedDashboard; }
  get selectedAddApp(): boolean { return this.state.selectedAddApp; }
  get selectedWordCloud(): boolean { return this.state.selectedWordCloud; }
  get selectedSmartWordCloud(): boolean { return this.state.selectedSmartWordCloud; }
  get selectedDocumentation(): boolean { return this.state.selectedDocumentation; }
  get selectedChat(): boolean { return this.state.selectedChat; }
}
