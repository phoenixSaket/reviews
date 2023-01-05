import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareAppsComponent } from './compare-apps.component';

describe('CompareAppsComponent', () => {
  let component: CompareAppsComponent;
  let fixture: ComponentFixture<CompareAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareAppsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
