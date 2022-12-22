import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalInlineAlertComponent } from './universal-inline-alert.component';

describe('UniversalInlineAlertComponent', () => {
  let component: UniversalInlineAlertComponent;
  let fixture: ComponentFixture<UniversalInlineAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalInlineAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalInlineAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
