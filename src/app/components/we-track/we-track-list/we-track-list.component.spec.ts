import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackListComponent } from './we-track-list.component';

describe('WeTrackListComponent', () => {
  let component: WeTrackListComponent;
  let fixture: ComponentFixture<WeTrackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
