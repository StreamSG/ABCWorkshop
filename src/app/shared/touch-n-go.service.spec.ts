import { TestBed } from '@angular/core/testing';

import { TouchNGoService } from './touch-n-go.service';

describe('TouchNGoService', () => {
  let service: TouchNGoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchNGoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
