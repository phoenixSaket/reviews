import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancedChatComponent } from './enhanced-chat.component';

describe('EnhancedChatComponent', () => {
  let component: EnhancedChatComponent;
  let fixture: ComponentFixture<EnhancedChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnhancedChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnhancedChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
