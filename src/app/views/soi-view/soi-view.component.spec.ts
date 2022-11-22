import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoiViewComponent } from './soi-view.component';

describe('NewSoiViewComponent', () => {
  let component: SoiViewComponent;
  let fixture: ComponentFixture<SoiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoiViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
