import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpViewComponent } from './help-view.component';

describe('HelpViewComponent', () => {
  let component: HelpViewComponent;
  let fixture: ComponentFixture<HelpViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
