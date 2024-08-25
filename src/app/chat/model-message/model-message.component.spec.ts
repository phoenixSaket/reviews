import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMessageComponent } from './model-message.component';

describe('ModelMessageComponent', () => {
  let component: ModelMessageComponent;
  let fixture: ComponentFixture<ModelMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
