import { TestBed } from '@angular/core/testing';

import { HelpService } from './help-service.service';

describe('HelpServiceService', () => {
  let service: HelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
