import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSubviewComponent } from './customer-subview.component';

describe('CustomerSubviewComponent', () => {
  let component: CustomerSubviewComponent;
  let fixture: ComponentFixture<CustomerSubviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSubviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSubviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
