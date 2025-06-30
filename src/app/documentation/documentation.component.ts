import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  public features: any[] = [
    { title: "AI Tools", text: "Understand the reviews better using AI Tools powered by Google Gemini.", icon: 'smart_toy' },    
    { title: "Dashboard", text: "Pie & Bar charts for the ratings received by your apps", icon: 'dashboard' },
    { title: "Add Apps", text: "Add any app from Google Play Store and Apple App Store", icon: 'add_circle' },
    { title: "Word Clouds", text: "Generate word clouds for based on the reviews & sentiments", icon: 'cloud' },
    { title: "Monitor Apps", text: "Stay updated with the latest ratings and reviews for your added apps", icon: 'monitor' },
    { title: "Sort & Filter", text: "Sort and filter your apps with versions, years, ratings, keyword", icon: 'filter_list' },
    { title: "Compare Apps", text: "Compare apps with the market and the competitors", icon: 'compare_arrows' },
    { title: "New Apps Popup", text: "Get a popup with the reviews of your apps received while you were away", icon: 'notifications' }
  ];

  public benefits: any[] = [
    { 
      title: "Comprehensive Analytics", 
      description: "Get deep insights with cross-platform analytics covering both iOS and Android app stores",
      icon: 'analytics'
    },
    { 
      title: "AI-Powered Insights", 
      description: "Leverage Google Gemini AI for intelligent review analysis and actionable recommendations",
      icon: 'psychology'
    },
    { 
      title: "Real-Time Monitoring", 
      description: "Stay updated with instant notifications and live monitoring of your app performance",
      icon: 'monitor_heart'
    },
    { 
      title: "Advanced Filtering", 
      description: "Powerful filtering and comparison tools to analyze reviews by various criteria",
      icon: 'filter_alt'
    },
    { 
      title: "User-Friendly Interface", 
      description: "Intuitive design with powerful features that make complex analytics simple",
      icon: 'design_services'
    },
    { 
      title: "Cross-Platform Sync", 
      description: "Seamlessly manage reviews from multiple platforms in one unified dashboard",
      icon: 'sync'
    }
  ];

  public images: any[] = ["https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/1.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/2.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/3.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/4.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/5.jpg"];

  public selectedImgIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.rotator();
  }

  rotator() {
    let localthis = this;

    function rotate() {
      if (localthis.images.length - 1 > localthis.selectedImgIndex) {
        localthis.selectedImgIndex += 1;
      } else {
        localthis.selectedImgIndex = 0;
      }
      localthis.rotator();
    }

    setTimeout(() => {
      rotate();
    }, 3000)
  }

  download(link: string) {
    let page = '';
    switch (link) {
      case "android": page = "https://github.com/phoenixSaket/reviews/blob/main/src/assets/apps/reviews-dashboard.apk?raw=true";
        break;
      case "ios": page = "https://github.com/phoenixSaket/reviews/blob/main/src/assets/apps/ios_source.tar.gz?raw=true"
        break;
    }
    window.open(page, '_blank');
  }
}
