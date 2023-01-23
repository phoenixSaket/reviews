import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentCloudComponent } from './sentiment-cloud.component';

describe('SentimentCloudComponent', () => {
  let component: SentimentCloudComponent;
  let fixture: ComponentFixture<SentimentCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimentCloudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
