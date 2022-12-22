import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsSubviewComponent } from './tests-subview.component';

describe('TestsSubviewComponent', () => {
  let component: TestsSubviewComponent;
  let fixture: ComponentFixture<TestsSubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsSubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsSubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
