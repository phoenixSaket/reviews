import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  public features: any[] = [
    {title: "Dashboard", text: "Pie & Bar charts for the ratings received by your apps"},
    {title: "Add Apps", text: "Add any app from Google Play Store and Apple App Store"},
    {title: "Word Clouds", text: "Generate word clouds for based on the reviews & sentiments"},
    {title: "Monitor Apps", text: "Stay updated with the latest ratings and reviews for your added apps"},
    {title: "Sort & Filter", text: "Sort and filter your apps with versions, years, ratings, keyword"},
    {title: "Compare Apps", text: "Compare apps with the market and the competitors"},
    {title: "New Apps Popup", text: "Get a popup with the reviews of your apps received while you were away"}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
