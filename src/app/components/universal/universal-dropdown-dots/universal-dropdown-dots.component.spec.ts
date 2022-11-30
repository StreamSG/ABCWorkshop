import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalDropdownDotsComponent } from './universal-dropdown-dots.component';

describe('UniversalDropdownDotsComponent', () => {
  let component: UniversalDropdownDotsComponent;
  let fixture: ComponentFixture<UniversalDropdownDotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalDropdownDotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalDropdownDotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
