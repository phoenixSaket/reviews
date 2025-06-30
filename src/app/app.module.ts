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
import { HistogramComponent } from './histogram/histogram.component';
import { HttpClientModule } from '@angular/common/http';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { HomepageComponent } from './homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from "@angular/material/icon";
import { CompareAppsComponent } from './compare-apps/compare-apps.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WordcloudComponent } from './wordcloud/wordcloud.component';
import { MatDialogModule } from '@angular/material/dialog';
import {  } from '@angular/material/dialog';
import { WordDialogComponent } from './word-dialog/word-dialog.component';
import { SentimentCloudComponent } from './sentiment-cloud/sentiment-cloud.component';
import { GetEmailComponent } from './get-email/get-email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { NewReviewsComponent } from './new-reviews/new-reviews.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { SentimentReviewsComponent } from './sentiment-reviews/sentiment-reviews.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GenerativeComponent } from './generative/generative.component';
import { LoaderComponent } from './loader/loader.component';
import { ChatComponent } from './chat/chat.component';
import { UserMessageComponent } from './chat/user-message/user-message.component';
import { ModelMessageComponent } from './chat/model-message/model-message.component';
import { ReviewComponent } from './chat/review/review.component';



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
    HistogramComponent,
    ReviewsPageComponent,
    HomepageComponent,
    CompareAppsComponent,
    WordcloudComponent,
    WordDialogComponent,
    SentimentCloudComponent,
    GetEmailComponent,
    ErrorDialogComponent,
    NewReviewsComponent,
    DocumentationComponent,
    SentimentReviewsComponent,
    GenerativeComponent,
    LoaderComponent,
    ChatComponent,
    UserMessageComponent,
    ModelMessageComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgApexchartsModule,
    MatExpansionModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
