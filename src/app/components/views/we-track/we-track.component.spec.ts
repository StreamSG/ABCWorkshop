import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackComponentOld } from './we-track.component';

describe('WeTrackComponent', () => {
  let component: WeTrackComponentOld;
  let fixture: ComponentFixture<WeTrackComponentOld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackComponentOld ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackComponentOld);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
