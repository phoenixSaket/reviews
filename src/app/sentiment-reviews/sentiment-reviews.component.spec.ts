import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentReviewsComponent } from './sentiment-reviews.component';

describe('SentimentReviewsComponent', () => {
  let component: SentimentReviewsComponent;
  let fixture: ComponentFixture<SentimentReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimentReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
