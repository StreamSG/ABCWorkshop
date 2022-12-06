import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalTicketTypeComponent } from './universal-ticket-type.component';

describe('UniversalTicketTypeComponent', () => {
  let component: UniversalTicketTypeComponent;
  let fixture: ComponentFixture<UniversalTicketTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversalTicketTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
