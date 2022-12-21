import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySubviewComponent } from './history-subview.component';

describe('HistorySubviewComponent', () => {
  let component: HistorySubviewComponent;
  let fixture: ComponentFixture<HistorySubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorySubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
