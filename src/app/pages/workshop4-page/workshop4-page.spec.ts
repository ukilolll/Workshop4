import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workshop4Page } from './workshop4-page';

describe('Workshop4Page', () => {
  let component: Workshop4Page;
  let fixture: ComponentFixture<Workshop4Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workshop4Page]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Workshop4Page);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
