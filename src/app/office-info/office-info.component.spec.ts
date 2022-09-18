import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeInfoComponent } from './office-info.component';

describe('OfficeInfoComponent', () => {
  let component: OfficeInfoComponent;
  let fixture: ComponentFixture<OfficeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
