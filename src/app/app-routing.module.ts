import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReviewComponent } from './add-review/add-review.component';
import { CompareAppsComponent } from './compare-apps/compare-apps.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';

const routes: Routes = [
  {path: "", component: DashboardComponent},
  {path: "compare", component: CompareAppsComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "reviews", component: ReviewsPageComponent},
  {path: "add-app", component: AddReviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
