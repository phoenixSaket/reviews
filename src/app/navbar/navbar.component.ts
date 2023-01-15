import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() apps: any[] = [];
  public isSideBarOpen: boolean = false;

  constructor(public sidebar: SidebarService, public data: DataService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    let page = this.data.getCurrentPage();
  }

  toggleSideBar() {
    // this.isSideBarOpen = !this.isSideBarOpen;
    if(this.sidebar.getIsSidebarOpen()) {
      this.sidebar.closeSidebar();
    } else {
      this.sidebar.openSidebar();
    }
  }

}
