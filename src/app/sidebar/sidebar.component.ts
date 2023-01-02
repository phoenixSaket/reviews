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
  @Input() apps : any[] = [];

  constructor(private data: DataService, private router: Router, private sidebar: SidebarService) { }

  ngOnInit(): void {
  }

  openApp(app: any) {
    this.data.setCurrentApp(app);
    this.router.navigate(["/reviews"]);

    if(screen.width < 500) {
      this.sidebar.closeSidebar();
    }
  }

}
