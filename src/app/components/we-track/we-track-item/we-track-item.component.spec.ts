import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackItemComponent } from './we-track-item.component';

describe('WeTrackItemComponent', () => {
  let component: WeTrackItemComponent;
  let fixture: ComponentFixture<WeTrackItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
