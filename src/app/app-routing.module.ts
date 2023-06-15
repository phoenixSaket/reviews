import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReviewComponent } from './add-review/add-review.component';
import { CompareAppsComponent } from './compare-apps/compare-apps.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { SentimentCloudComponent } from './sentiment-cloud/sentiment-cloud.component';
import { WordcloudComponent } from './wordcloud/wordcloud.component';
import { SentimentReviewsComponent } from './sentiment-reviews/sentiment-reviews.component';

const routes: Routes = [
  {path: "", component: DashboardComponent},
  {path: "compare", component: CompareAppsComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "reviews", component: ReviewsPageComponent},
  {path: "add-app", component: AddReviewComponent},
  {path: "word-cloud", component: WordcloudComponent},
  {path: "sentiment-cloud", component: SentimentCloudComponent},
  {path: "docs", component: DocumentationComponent},
  {path: "sentiment-reviews", component: SentimentReviewsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
