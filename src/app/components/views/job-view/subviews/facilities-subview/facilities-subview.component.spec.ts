import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiesSubviewComponent } from './facilities-subview.component';

describe('FacilitiesSubviewComponent', () => {
  let component: FacilitiesSubviewComponent;
  let fixture: ComponentFixture<FacilitiesSubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilitiesSubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitiesSubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
