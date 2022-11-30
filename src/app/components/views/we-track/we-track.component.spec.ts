import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackComponent } from './we-track.component';

describe('WeTrackComponent', () => {
  let component: WeTrackComponent;
  let fixture: ComponentFixture<WeTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
