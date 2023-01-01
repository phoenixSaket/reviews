import { Component, Input, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() apps: any[] = [];
  public isSideBarOpen: boolean = false;

  constructor(private sidebar: SidebarService) { }

  ngOnInit(): void {
  }

  toggleSideBar() {
    this.isSideBarOpen = !this.isSideBarOpen;
    if(this.isSideBarOpen) {
      this.sidebar.closeSidebar();
    } else {
      this.sidebar.openSidebar();
    }
  }

}
