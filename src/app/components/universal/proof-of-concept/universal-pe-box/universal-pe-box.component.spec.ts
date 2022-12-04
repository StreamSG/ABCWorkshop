import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalPeBoxComponent } from './universal-pe-box.component';

describe('UniversalPeBoxComponent', () => {
  let component: UniversalPeBoxComponent;
  let fixture: ComponentFixture<UniversalPeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalPeBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalPeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
