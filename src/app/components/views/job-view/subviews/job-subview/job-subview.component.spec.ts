import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSubviewComponent } from './job-subview.component';

describe('JobSubviewComponent', () => {
  let component: JobSubviewComponent;
  let fixture: ComponentFixture<JobSubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
