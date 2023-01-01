import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIosComponent } from './card-ios.component';

describe('CardIosComponent', () => {
  let component: CardIosComponent;
  let fixture: ComponentFixture<CardIosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardIosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
