import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppCardComponent } from './add-app-card.component';

describe('AddAppCardComponent', () => {
  let component: AddAppCardComponent;
  let fixture: ComponentFixture<AddAppCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAppCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAppCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
