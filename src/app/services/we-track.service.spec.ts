import { TestBed } from '@angular/core/testing';

import { WeTrackService } from './we-track.service';

describe('WeTrackService', () => {
  let service: WeTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
