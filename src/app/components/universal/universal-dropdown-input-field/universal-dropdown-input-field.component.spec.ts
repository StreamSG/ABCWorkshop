import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalDropdownInputFieldComponent } from './universal-dropdown-input-field.component';

describe('UniversalDropdownInputFieldComponent', () => {
  let component: UniversalDropdownInputFieldComponent;
  let fixture: ComponentFixture<UniversalDropdownInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalDropdownInputFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalDropdownInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
