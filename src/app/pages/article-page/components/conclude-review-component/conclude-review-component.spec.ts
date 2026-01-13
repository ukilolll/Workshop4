import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcludeReviewComponent } from './conclude-review-component';

describe('ConcludeReviewComponent', () => {
  let component: ConcludeReviewComponent;
  let fixture: ComponentFixture<ConcludeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcludeReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcludeReviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
