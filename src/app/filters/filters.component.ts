import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  public ratings: any[] = [
    {text: 1, isSelected: true},
    {text: 2, isSelected: true},
    {text: 3, isSelected: true},
    {text: 4, isSelected: true},
    {text: 5, isSelected: true}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
