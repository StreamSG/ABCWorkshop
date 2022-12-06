import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalFullScreenModalComponent } from './universal-full-screen-modal.component';

describe('UniversalFullScreenModalComponent', () => {
  let component: UniversalFullScreenModalComponent;
  let fixture: ComponentFixture<UniversalFullScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalFullScreenModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalFullScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
