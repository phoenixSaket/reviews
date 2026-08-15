import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isSidebarOpen: boolean = typeof window !== 'undefined' ? window.innerWidth > 1024 : true;
  public isCollapsed: boolean = false;

  constructor() { }

  openSidebar() {
    this.isSidebarOpen = true;
    const el = document.getElementById("sidebar");
    if (el) {
      el.classList.remove("close");
      el.classList.add("open");
    }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    const el = document.getElementById("sidebar");
    if (el) {
      el.classList.remove("open");
      el.classList.add("close");
    }
  }

  toggleSidebar() {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  getIsSidebarOpen() {
    return this.isSidebarOpen;
  }
}

