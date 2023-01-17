import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isSidebarOpen: boolean = true;

  constructor() { }

  openSidebar() {
    document.getElementById("sidebar")?.classList.remove("close");
    document.getElementById("sidebar")?.classList.add("open");
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebar")?.classList.add("close");
    this.isSidebarOpen = false;
  }

  getIsSidebarOpen() {
    return this.isSidebarOpen;
  }
}
