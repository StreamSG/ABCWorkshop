import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchNGoComponent } from './touch-n-go.component';

describe('TouchNGoComponent', () => {
  let component: TouchNGoComponent;
  let fixture: ComponentFixture<TouchNGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouchNGoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouchNGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
