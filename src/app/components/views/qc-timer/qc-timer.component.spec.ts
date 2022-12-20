import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcTimerComponent } from './qc-timer.component';

describe('QcTimerComponent', () => {
  let component: QcTimerComponent;
  let fixture: ComponentFixture<QcTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcTimerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
