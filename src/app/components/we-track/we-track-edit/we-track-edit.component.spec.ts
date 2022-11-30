import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackEditComponent } from './we-track-edit.component';

describe('WeTrackEditComponent', () => {
  let component: WeTrackEditComponent;
  let fixture: ComponentFixture<WeTrackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
