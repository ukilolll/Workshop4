import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UkiComponent } from './uki-component';

describe('UkiComponent', () => {
  let component: UkiComponent;
  let fixture: ComponentFixture<UkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UkiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UkiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
