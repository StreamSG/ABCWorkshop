import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalFacilitiesCardComponent } from './universal-facilities-card.component';

describe('UniversalFacilitiesCardComponent', () => {
  let component: UniversalFacilitiesCardComponent;
  let fixture: ComponentFixture<UniversalFacilitiesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalFacilitiesCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalFacilitiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
