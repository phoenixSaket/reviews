import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CardAndroidComponent } from './card-android/card-android.component';
import { CardIosComponent } from './card-ios/card-ios.component';
import { FiltersComponent } from './filters/filters.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { AddAppCardComponent } from './add-app-card/add-app-card.component';
import { HistogramComponent } from './histogram/histogram.component';
import { HttpClientModule } from '@angular/common/http';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    CardAndroidComponent,
    CardIosComponent,
    FiltersComponent,
    DashboardComponent,
    AddReviewComponent,
    AddAppCardComponent,
    HistogramComponent,
    ReviewsPageComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
