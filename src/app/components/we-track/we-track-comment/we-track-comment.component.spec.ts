import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeTrackCommentComponent } from './we-track-comment.component';

describe('WeTrackCommentComponent', () => {
  let component: WeTrackCommentComponent;
  let fixture: ComponentFixture<WeTrackCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeTrackCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeTrackCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
