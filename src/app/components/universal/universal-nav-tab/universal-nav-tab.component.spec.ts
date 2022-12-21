import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalNavTabComponent } from './universal-nav-tab.component';

describe('UniversalNavTabComponent', () => {
  let component: UniversalNavTabComponent;
  let fixture: ComponentFixture<UniversalNavTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalNavTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalNavTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
