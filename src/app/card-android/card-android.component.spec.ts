import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAndroidComponent } from './card-android.component';

describe('CardAndroidComponent', () => {
  let component: CardAndroidComponent;
  let fixture: ComponentFixture<CardAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAndroidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
